import { createInterface, emitKeypressEvents } from "readline";
import printf from "./util/printf";
import verifyIfTheExecExistsOrHasPermissions from "./util/findFile";
import external_commands from "./commands/external_commands";
import processExp from "./util/processExp";
import processRedirectionOperators from "./util/processRedirectionOperator";
import type { outputType } from "./util/outputType";
import processOutput from "./util/processOutput";
import { Trie } from "./util/TrieTree";
import getAllExecs from "./util/getAllExec";
import { splitPipeline } from "./util/splitPipeline";
import { executePipeline } from "./commands/pipeline";
import { executeCommand, builtinCommands } from "./util/execBuiltin";
import { addHistory } from "./util/historyStore";
import typef from "./commands/type";
import echo from "./commands/echo";
import pwd from "./commands/pwd";
import cd from "./commands/cd";

const execs = await getAllExecs();
const trie = new Trie();
const allCommands = [...builtinCommands, ...execs];
allCommands.forEach((com) => trie.insert(com));

let lastKeyWasTab = false;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  completer: () => [[], ""],
});

rl.setPrompt("$ ");

emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

process.stdin.on("keypress", (str, key) => {
  if (key && key.name === "tab") {
    const input = rl.line;
    const matches = trie.startsWith(input);

    if (matches.length === 1) {
      const match = matches[0];
      const remainder = match.slice(input.length) + " ";
      rl.write(remainder);
      lastKeyWasTab = false;
    } else if (matches.length > 1) {
      const lcp = trie.findLongestCommonPrefix(input);
      if (lcp.length > input.length) {
        const remainder = lcp.slice(input.length);
        rl.write(remainder);
        lastKeyWasTab = false;
      } else {
        if (!lastKeyWasTab) {
          process.stdout.write("\x07");
          lastKeyWasTab = true;
        } else {
          process.stdout.write("\n");
          process.stdout.write(matches.sort().join("  "));
          process.stdout.write("\n");
          rl.prompt(true);
          lastKeyWasTab = false;
        }
      }
    } else {
      process.stdout.write("\x07");
      lastKeyWasTab = false;
    }
  } else {
    if (key && key.name !== "tab") {
      lastKeyWasTab = false;
    }
  }
});

rl.on("close", () => {
  process.exit(0);
});

function exit() {
  rl.close();
}

function noCommandMatch(command: string): outputType {
  return {
    erro: true,
    content: `${command}: command not found\n`,
  };
}

function main() {
  let output: outputType = { erro: false, content: "" };
  printf("$ ");
  rl.on("line", async (input) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      printf("$ ");
      return;
    }

    addHistory(trimmedInput);

    const pipelineParts = splitPipeline(input);
    if (pipelineParts.length > 1) {
      await executePipeline(input, pipelineParts);
      printf("$ ");
      return;
    }

    let redirectionInfo: string[] = [];
    const expression = processExp(input);
    [expression.args, redirectionInfo] =
      processRedirectionOperators(expression);
    const command = expression.command ?? "";

    if (command === "exit") {
      exit();
      return;
    }

    const builtinResult = await executeCommand(command, expression.args);

    if (builtinResult !== null) {
      output = builtinResult;
    } else {
      if (await verifyIfTheExecExistsOrHasPermissions(command))
        output = await external_commands(command, expression.args);
      else output = noCommandMatch(command);
    }

    await processOutput(output, redirectionInfo);
    printf("$ ");
  });
}

main();
