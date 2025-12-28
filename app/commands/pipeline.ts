import { spawn } from "child_process";
import { PassThrough } from "stream";
import processExp from "../util/processExp";
import type { outputType } from "../util/outputType";
import { executeCommand, isBuiltin } from "../util/execBuiltin";

function createBuiltinStream(command: string, args: string[]) {
  const stdin = new PassThrough();
  const stdout = new PassThrough();

  process.nextTick(async () => {
    stdin.resume();
    try {
      const result = await executeCommand(command, args);
      if (result && result.content) {
        stdout.write(result.content);
      }
    } catch {
    } finally {
      stdout.end();
    }
  });

  return { stdin, stdout, isBuiltin: true };
}

export async function executePipeline(
  input: string,
  rawCommands: string[],
): Promise<outputType> {
  const parsedCommands = rawCommands.map((cmdStr) => processExp(cmdStr));

  return new Promise((resolve) => {
    let previousProcess: any = null;
    const processes: any[] = [];

    for (let i = 0; i < parsedCommands.length; i++) {
      const { command, args } = parsedCommands[i];
      if (!command) continue;

      const isLast = i === parsedCommands.length - 1;
      let child: any;

      if (isBuiltin(command)) {
        child = createBuiltinStream(command, args);
        if (isLast) {
          child.stdout.pipe(process.stdout, { end: false });
        }
      } else {
        const stdin = i === 0 ? "inherit" : "pipe";
        const stdout = isLast ? "inherit" : "pipe";
        child = spawn(command, args, { stdio: [stdin, stdout, "inherit"] });
      }

      processes.push(child);

      if (previousProcess) {
        previousProcess.stdout.pipe(child.stdin);
      }

      previousProcess = child;
    }

    const lastProcess = processes[processes.length - 1];

    if (lastProcess.isBuiltin) {
      lastProcess.stdout.on("finish", () => {
        resolve({ erro: false, content: "" });
      });
    } else {
      lastProcess.on("close", () => {
        resolve({ erro: false, content: "" });
      });
      lastProcess.on("error", () => {
        resolve({ erro: true, content: "" });
      });
    }
  });
}
