import { delimiter, join } from "node:path";
import { access, constants } from "node:fs/promises";

async function verifyIfTheExecExistsOrHasPermissions(value: string) {
  const allDirs = Bun.env.PATH?.split(delimiter);
  if (!allDirs) return null;
  for (const dir of allDirs) {
    const fullPath = join(dir, value);
    try {
      await access(fullPath, constants.X_OK);
      return fullPath;
    } catch {
    }
  }

  return null;
}

console.log(await verifyIfTheExecExistsOrHasPermissions("grep"));
