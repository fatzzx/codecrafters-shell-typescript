import { createInterface } from "readline";
import typef from "./commands/type";
import printf from "./util/printf";
import echo from "./commands/echo";
import verifyIfTheExecExistsOrHasPermissions from "./util/findFile";
import external_commands from "./commands/external_commands";
import pwd from "./commands/pwd";
import cd from "./commands/cd";
import processExp from "./util/processExp";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("close", () => {
  process.exit(0);
});

function exit() {
  rl.close();
}

function noCommandMatch(command: string) {
  printf(`${command}: command not found\n`);
}

function main() {
  const builtinCommands = ["echo", "type", "exit", "pwd", "cd"];
  printf("$ ");
  rl.on("line", async (input) => {
    if (!input.trim()) {
      printf("$ ");
      return;
    }
    const expression = processExp(input);
    const command = expression.command ?? ''
    switch (command) {
      case "exit":
        exit();
        return;
      case "echo":
        echo(expression.args.join(' '));
        break;
      case "type":
        await typef(expression.args.join(' '), builtinCommands);
        break;
      case "pwd":
        pwd();
        break;
      case "cd":
        await cd(expression.args.join(' '));
        break;
      default:
        if (await verifyIfTheExecExistsOrHasPermissions(command))
          await external_commands(command, expression.args);
        else noCommandMatch(command);
    }
    printf("$ ");
  });
}

main();
