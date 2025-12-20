import printf from "../util/printf";

export default function pwd() {
  printf(process.cwd() + "\n");
}
