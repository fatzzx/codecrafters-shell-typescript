import printf from "../util/printf";

export default function echo(value: string) {
  return {
    erro: false,
    content: value + "\n"
  }
}
