import { readdir } from "node:fs/promises";
import { delimiter } from "node:path";

export default async function getAllExecs() {
  const allDirs = Bun.env.PATH?.split(delimiter) ?? [];
  let execs = [];
  for (const dir of allDirs) {
    try {
      const files = (await readdir(dir)) ?? [];
      for (const file of files) execs.push(file);
    } catch {
      continue;
    }
  }
  return execs;
}
