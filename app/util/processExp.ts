import type { exp } from "./expType";


export default function processExp(exp : string) : exp{
    let expression : exp = {command : null, args : []};
    exp = exp.trim();
    for(let i = 0; i < exp.length; i++){
        if(exp[i] != ' '){
            let tmpStr = '';
            while(exp[i] != ' ' && exp[i] != "'" && i + 1 <= exp.length){
                if(exp[i + 1] == ' ') {
                    tmpStr += exp[i];
                    tmpStr += exp[i + 1];
                    i++;
                    continue;
                }
                tmpStr += exp[i];
                i++;
            }
            (expression.command) ? expression.args.push(tmpStr) : expression.command = tmpStr.trim();
        } 
        if(exp[i] == ' '){
            if(i + 1 <= exp.length && exp[i + 1] != ' ') expression.args.push(' ');
            while(i + 1 <= exp.length && exp[i + 1] == ' '){
                i++;
            }
        }
        if(exp[i] == "'"){
            let tmpStr = '';
            
            while(i + 1 <= exp.length && !(exp[i + 1] == "'")){
                if(exp[i] == "'"){
                    i++;
                    continue;
                }
                tmpStr += exp[i];
                i++;
            }
            if((exp[i + 1] == "'")) tmpStr += exp[i];
            i++;
            if(tmpStr != "'" && tmpStr.trim()) expression.args.push(tmpStr)
        }
    }
    return expression;
}