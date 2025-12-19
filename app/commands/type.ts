import verifyIfTheExecExistsOrHasPermissions from "../util/findFile";
import printf from "../util/printf";

export default async function typef(
  value: string,
  availableCommands: string[],
) {
  if (availableCommands.includes(value)) {
    printf(`${value} is a shell builtin\n`);
  } else {
    let localExec = await verifyIfTheExecExistsOrHasPermissions(value);
    if (localExec) {
      printf(`${value} is ${localExec}\n`);
    } else printf(`${value}: not found\n`);
  }
}
