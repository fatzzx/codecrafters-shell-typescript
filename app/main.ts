import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printf(value : string) {
  process.stdout.write(value);
}

rl.on('close', () => {
  process.exit(0);
});

function exit(){
    rl.close()
}

function echo(value : string) {
  printf(value + '\n');
}

function noCommandMatch(command : string){
  printf(`${command}: command not found\n`)
}

function typef(value : string, availableCommands : string[]) {
  if(availableCommands.includes(value)) {
    printf(`${value} is a shell builtin\n`)
  } else {
    let localExec = Bun.which(value);
    if(localExec){
      printf(`${value} is ${localExec}\n`)
    }
    else printf(`${value}: not found\n`);
  }
}

function main(){
  const builtinCommands = ['echo', 'type', 'exit'];
  printf('$ ')
  rl.on('line', (input) => {
    let inputArray = input.trim().split(' ');
    const command = inputArray[0]
    let args = (inputArray.length > 1) ? inputArray.slice(1).join(' ') : '';
    switch(command){
      case 'exit':
        exit();
        return;
      case 'echo':
        echo(args);
        break;
      case'type':
        typef(args, builtinCommands);
        break;
      default:
        noCommandMatch(command);
    }
    printf('$ ')
  })
}

main();