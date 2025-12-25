import type { exp } from "./expType";

export default function processRedirectionOperators(expression: exp) {
  const redirectOperators = [">", "1>", "2>", ">>", "1>>", "2>>"];
  let newArgArr: string[] = [];
  let redirectionInfo: string[] = [];
  for (let i = 0; i < expression.args.length; i++) {
    if (redirectOperators.includes(expression.args[i])) {
      newArgArr = expression.args.slice(0, i);
      redirectionInfo = expression.args.slice(i);
      return [newArgArr, redirectionInfo];
    }
  }
  return [expression.args, []];
}
