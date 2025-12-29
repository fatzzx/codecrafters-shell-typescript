import { getHistory } from "../util/historyStore";
import type { outputType } from "../util/outputType";

export default function historyCommand(): outputType {
  const hist = getHistory();
  const content =
    hist.map((cmd, index) => `    ${index + 1}  ${cmd}`).join("\n") + "\n";

  return { erro: false, content };
}
