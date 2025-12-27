import { spawn } from "child_process";
import processExp from "../util/processExp";
import type { outputType } from "../util/outputType";

export async function executePipeline(
  input: string,
  rawCommands: string[],
): Promise<outputType> {
  const parsedCommands = rawCommands.map((cmdStr) => processExp(cmdStr));

  return new Promise((resolve) => {
    let previousProcess: any = null;
    const children: any[] = [];

    for (let i = 0; i < parsedCommands.length; i++) {
      const { command, args } = parsedCommands[i];
      if (!command) continue;

      const isFirst = i === 0;
      const isLast = i === parsedCommands.length - 1;

      const stdin = isFirst ? "inherit" : "pipe";
      const stdout = isLast ? "inherit" : "pipe";

      const child = spawn(command, args, {
        stdio: [stdin, stdout, "inherit"],
      });

      children.push(child);

      if (previousProcess) {
        previousProcess.stdout.pipe(child.stdin);
      }

      previousProcess = child;
    }
    const lastChild = children[children.length - 1];

    lastChild.on("close", () => {
      resolve({ erro: false, content: "" });
    });

    lastChild.on("error", (err: any) => {
      console.error(`Error: ${err.message}`);
      resolve({ erro: true, content: "" });
    });
  });
}
