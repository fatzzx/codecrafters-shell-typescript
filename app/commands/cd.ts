import printf from "../util/printf";
import { stat } from "node:fs/promises";

export default async function cd(path: string) {
  try {
    const stats = await stat(path);
    if (stats.isDirectory()) process.chdir(path);
    else printf(`cd: ${path}: No such file or directory\n`);
  } catch {
    printf(`cd: ${path}: No such file or directory\n`);
  }
}
