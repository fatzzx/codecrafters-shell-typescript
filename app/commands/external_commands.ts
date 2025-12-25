import { stdout } from "bun";
import printf from "../util/printf";

export default async function external_commands(path: string, args: string[]) {
  const proc = Bun.spawn([path, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const outputStdout = await new Response(proc.stdout).text();
  const outputStderr = await new Response(proc.stderr).text();

  await proc.exited;

  return {
    erro: proc.exitCode !== 0,
    content: outputStdout,
    stderr: outputStderr,
  };
}
