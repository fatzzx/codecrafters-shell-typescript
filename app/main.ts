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


function main(){
  printf('$ ')
  rl.on('line', (input) => {
    let inputArray = input.trim().split(' ');
    const command = inputArray[0]
    let args = (inputArray.length > 1) ? inputArray.slice(1).join(' ') : '';

    switch(command){
      case 'exit':
        exit()
        return;
      case 'echo':
        echo(args);
        break;
      default:
        noCommandMatch(command);
    }

    printf('$ ')
  })
}

main();