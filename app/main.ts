import { createInterface } from "readline";
import typef from "./commands/type";
import printf from "./util/printf";
import echo from "./commands/echo";
import verifyIfTheExecExistsOrHasPermissions from "./util/findFile";
import external_commands from "./commands/external_commands";
import pwd from "./commands/pwd";
import cd from "./commands/cd";
import processExp from "./util/processExp";
import processRedirectionOperators from "./util/processRedirectionOperator";
import type { outputType } from "./util/outputType";
import { error } from "console";
import processOutput from "./util/processOutput";
import { Trie } from "./util/TrieTree";

const builtinCommands = ["echo", "type", "exit", "pwd", "cd"];

function completer(currentInput: string) {
  const trie = new Trie();
  builtinCommands.forEach((com) => trie.insert(com));
  return [trie.startsWith(currentInput), currentInput];
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  completer: completer,
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
    if (!input.trim()) {
      printf("$ ");
      return;
    }
    let redirectionInfo: string[] = [];
    const expression = processExp(input);
    [expression.args, redirectionInfo] =
      processRedirectionOperators(expression);
    const command = expression.command ?? "";
    switch (command) {
      case "exit":
        exit();
        return;
      case "echo":
        output = echo(expression.args.join(" "));
        break;
      case "type":
        output = await typef(expression.args.join(" "), builtinCommands);
        break;
      case "pwd":
        output = pwd();
        break;
      case "cd":
        output = (await cd(expression.args.join(" "))) ?? {
          erro: false,
          content: "",
        };
        break;
      default:
        if (await verifyIfTheExecExistsOrHasPermissions(command))
          output = await external_commands(command, expression.args);
        else output = noCommandMatch(command);
    }
    await processOutput(output, redirectionInfo);
    printf("$ ");
  });
}

main();
