import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printf(valor : string) {
  process.stdout.write(valor);
}

printf('$ ')
rl.on('line', (input) => {
  printf(`${input}: command not found\n`)
  printf('$ ')
})