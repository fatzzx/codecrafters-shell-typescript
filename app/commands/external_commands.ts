import { stdout } from "bun";

export default async function external_commands(path: string, args: string) {
  const proc = Bun.spawn([path, ...args.split(" ")], {
    stdout: "inherit",
  });
  await proc.exited;
}
