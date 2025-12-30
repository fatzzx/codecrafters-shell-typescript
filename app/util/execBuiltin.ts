import echo from "../commands/echo";
import typef from "../commands/type";
import pwd from "../commands/pwd";
import cd from "../commands/cd";
import historyCommand from "../commands/history";
import type { outputType } from "./outputType";

export const builtinCommands = ["echo", "type", "exit", "pwd", "cd", "history"];

export async function executeCommand(
  command: string,
  args: string[],
): Promise<outputType | null> {
  switch (command) {
    case "echo":
      return echo(args.join(" "));
    case "type":
      return await typef(args.join(" "), builtinCommands);
    case "pwd":
      return pwd();
    case "cd":
      return (await cd(args.join(" "))) ?? { erro: false, content: "" };
    case "history":
      return await historyCommand(args);
    case "exit":
      return { erro: false, content: "" };
    default:
      return null;
  }
}

export function isBuiltin(command: string): boolean {
  return builtinCommands.includes(command);
}
