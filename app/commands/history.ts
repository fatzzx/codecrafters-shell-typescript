import {
  getHistory,
  addHistory,
  getNewHistory,
  markHistorySaved,
} from "../util/historyStore";
import type { outputType } from "../util/outputType";
import { readFile, writeFile, appendFile } from "fs/promises";
import { existsSync } from "fs";

export default async function historyCommand(
  args: string[] = [],
): Promise<outputType> {
  if (args.length >= 2 && args[0] === "-r") {
    const filePath = args[1];

    if (existsSync(filePath)) {
      try {
        const content = await readFile(filePath, "utf-8");
        const lines = content.split("\n");
        for (const line of lines) {
          if (line.trim()) {
            addHistory(line);
          }
        }
      } catch (error) {}
    }

    return { erro: false, content: "" };
  }

  if (args.length >= 2 && args[0] === "-w") {
    const filePath = args[1];
    const hist = getHistory();
    const content = hist.join("\n") + "\n";

    try {
      await writeFile(filePath, content, "utf-8");
      markHistorySaved();
    } catch (error) {}

    return { erro: false, content: "" };
  }

  if (args.length >= 2 && args[0] === "-a") {
    const filePath = args[1];
    const newCmds = getNewHistory();

    if (newCmds.length > 0) {
      const content = newCmds.join("\n") + "\n";
      try {
        await appendFile(filePath, content, "utf-8");
        markHistorySaved();
      } catch (error) {}
    }

    return { erro: false, content: "" };
  }

  const hist = getHistory();
  let count = hist.length;

  if (args.length > 0) {
    const parsed = parseInt(args[0], 10);
    if (!isNaN(parsed)) {
      count = parsed;
    }
  }

  const startIndex = Math.max(0, hist.length - count);

  const content =
    hist
      .map((cmd, index) => ({ index: index + 1, cmd }))
      .slice(startIndex)
      .map(({ index, cmd }) => `    ${index}  ${cmd}`)
      .join("\n") + "\n";

  return { erro: false, content };
}
