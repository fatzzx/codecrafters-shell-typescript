import { getHistory } from "../util/historyStore";
import type { outputType } from "../util/outputType";

export default function historyCommand(args: string[] = []): outputType {
  const hist = getHistory();
  let count = hist.length;

  if (args && args.length > 0) {
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
