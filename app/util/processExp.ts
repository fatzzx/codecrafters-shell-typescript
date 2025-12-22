import type { exp } from "./expType";

export default function processExp(exp : string) {
    let expression : exp = {command : null, args : []};
    let quote = false;
    let tmpStr = '';
    exp = exp.replace(/''/g, '');    
    for(let i = 0; i < exp.length; i++){
        if (exp[i] == "'"){
            quote = !quote;
            continue; 
        } 
        if(!quote){
            if(exp[i] == ' '){
                if(tmpStr){
                    (expression.command) ? expression.args.push(tmpStr) : expression.command = tmpStr;
                    tmpStr = '';
                }
                continue;
            }
            if(i + 1 == exp.length){
                tmpStr += exp[i];
                (expression.command) ? expression.args.push(tmpStr) : expression.command = tmpStr;
                tmpStr = '';
            }
            tmpStr += exp[i];
        }

        if(quote){
            tmpStr += exp[i];
            if((i + 1) <= exp.length && exp[i + 1] == "'"){
                if(tmpStr) {
                    expression.args.push(tmpStr);
                    tmpStr = '';
                }
            }

        }
    }
    return expression;
}

