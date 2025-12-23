import type { exp } from "./expType";

export default function processExp(exp: string) {
    let expression: exp = { command: null, args: [] };
    let currentArg = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let hasArgContent = false;
    const doubleQuoteSpecialChars = ['\\', '"', '$', '`', '\n'];

    for (let i = 0; i < exp.length; i++) {
        const char = exp[i];

        if (char === '\\') {
            if (inSingleQuote) {
                currentArg += char;
                hasArgContent = true;
            } else if (inDoubleQuote) {
                if (i + 1 < exp.length) {
                    const nextChar = exp[i + 1];
                    if (doubleQuoteSpecialChars.includes(nextChar)) {
                        currentArg += nextChar;
                        i++;
                    } else {
                        currentArg += char;
                    }
                    hasArgContent = true;
                } else {
                    currentArg += char;
                    hasArgContent = true;
                }
            } else {
                if (i + 1 < exp.length) {
                    currentArg += exp[i + 1];
                    i++;
                }
                hasArgContent = true;
            }
            continue;
        }

        if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
            hasArgContent = true;
            continue;
        }

        if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
            hasArgContent = true;
            continue;
        }

        if (char === ' ' && !inSingleQuote && !inDoubleQuote) {
            if (hasArgContent) {
                if (!expression.command) {
                    expression.command = currentArg;
                } else {
                    expression.args.push(currentArg);
                }
                currentArg = '';
                hasArgContent = false;
            }
            continue;
        }

        currentArg += char;
        hasArgContent = true;
    }

    if (hasArgContent) {
        if (!expression.command) {
            expression.command = currentArg;
        } else {
            expression.args.push(currentArg);
        }
    }

    return expression;
}