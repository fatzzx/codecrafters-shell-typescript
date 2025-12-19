import { join } from "node:path";
import { delimiter } from 'node:path';
import { access, constants } from 'node:fs/promises';
import printf from "../util/printf";



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


export default async function typef(value : string, availableCommands : string[]) {
  if(availableCommands.includes(value)) {
    printf(`${value} is a shell builtin\n`)
  } else {
    let localExec = await verifyIfTheExecExistsOrHasPermissions(value);
    if(localExec){
      printf(`${value} is ${localExec}\n`)
    }
    else printf(`${value}: not found\n`);
  }
}