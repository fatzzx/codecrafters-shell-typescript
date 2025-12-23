import { stdout } from "bun";
import printf from "../util/printf";

export default async function external_commands(path: string, args: string[]) {
  const proc = Bun.spawn([path, ...args], {
    stdout: "pipe"
  });

  const output = await new Response(proc.stdout).text();
  return {
    erro : (proc.exitCode !== 0) ? false : true,
    content : output
  }
}
