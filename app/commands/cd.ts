import printf from "../util/printf";
import { stat } from "node:fs/promises";

function handleHomeRef(path: string) {
  if (path[0] == "~") return Bun.env.HOME + path.slice(1);
  return path;
}

export default async function cd(path: string) {
  try {
    path = handleHomeRef(path);
    const stats = await stat(path);
    if (stats.isDirectory()) process.chdir(path);
    else return { erro: true, content: `cd: ${path}: No such file or directory\n` };
  } catch {
    return { erro: true, content: `cd: ${path}: No such file or directory\n` };
  }
}
