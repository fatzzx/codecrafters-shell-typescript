export function splitPipeline(input: string): string[] {
  const commands: string[] = [];
  let currentCommand = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    }

    if (char === "|" && !inSingleQuote && !inDoubleQuote) {
      commands.push(currentCommand.trim());
      currentCommand = "";
      continue;
    }

    currentCommand += char;
  }

  if (currentCommand.trim()) {
    commands.push(currentCommand.trim());
  }

  return commands;
}
