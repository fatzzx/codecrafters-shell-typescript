import type { outputType } from "./outputType";
import printf from "./printf";



export default async function processOutput(output : outputType, instructions : string[]){

    if(instructions.length == 0 || output.erro){
        printf(output.content)
        return;
    } 
    if(instructions.length >= 2){
        const filePath = instructions[1];
        await Bun.write(filePath, output.content);
    }
}