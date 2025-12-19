import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printf(valor : string) {
  process.stdout.write(valor);
}

rl.on('close', () => {
  process.exit(0);
});


printf('$ ')
rl.on('line', (input) => {

  const command = input.trim()

  if(input == 'exit') {
    rl.close()
    return;
  }
  printf(`${command}: command not found\n`)
  printf('$ ')
})