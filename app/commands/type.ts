import verifyIfTheExecExistsOrHasPermissions from "../util/findFile";
import type { outputType } from "../util/outputType";
import printf from "../util/printf";

export default async function typef(
  value: string,
  availableCommands: string[],
): Promise<outputType> {
  if (availableCommands.includes(value)) {
    return {
      erro: false,
      content: `${value} is a shell builtin\n`
    }
  } else {
    let localExec = await verifyIfTheExecExistsOrHasPermissions(value);
    if (localExec) {
      return {
        erro: true,
        content: `${value} is ${localExec}\n`
      }
    } else return {
      erro: true,
      content: `${value}: not found\n`
    }
  }
}
