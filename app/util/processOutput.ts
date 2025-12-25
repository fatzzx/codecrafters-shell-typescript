import type { outputType } from "./outputType";
import printf from "./printf";

export default async function processOutput(
  output: outputType,
  instructions: string[],
) {
  if (instructions.length === 0) {
    if (output.content) printf(output.content);
    if (output.erro && output.stderr) printf(output.stderr);
    return;
  }

  const operator = instructions[0];
  const filePath = instructions[1];

  const stderrContent = output.stderr || "";

  if (operator === "2>") {
    await Bun.write(filePath, stderrContent);

    if (output.content) printf(output.content);
    return;
  }

  if (operator === ">" || operator === "1>") {
    await Bun.write(filePath, output.content);

    if (output.erro) printf(stderrContent);
    return;
  }
}
