import type { outputType } from "../util/outputType";
import printf from "../util/printf";

export default function pwd() : outputType {
  return {
    erro : false,
    content : process.cwd() + "\n"
  } 
}
