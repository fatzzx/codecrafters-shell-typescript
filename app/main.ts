import { createInterface } from "readline";
import typef from "./commands/type";
import printf from "./util/printf";
import echo from "./commands/echo";
import verifyIfTheExecExistsOrHasPermissions from "./util/findFile";
import external_commands from "./commands/external_commands";
import pwd from "./commands/pwd";

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
  const builtinCommands = ["echo", "type", "exit", "pwd"];
  printf("$ ");
  rl.on("line", async (input) => {
    if (!input.trim()) {
      printf("$ ");
      return;
    }
    const inputArray = input.trim().split(/\s+/);
    const command = inputArray[0];
    let args = inputArray.length > 1 ? inputArray.slice(1).join(" ") : "";
    switch (command) {
      case "exit":
        exit();
        return;
      case "echo":
        echo(args);
        break;
      case "type":
        await typef(args, builtinCommands);
        break;
      case "pwd":
        pwd();
        break;
      default:
        if (await verifyIfTheExecExistsOrHasPermissions(command))
          await external_commands(command, args);
        else noCommandMatch(command);
    }
    printf("$ ");
  });
}

main();
