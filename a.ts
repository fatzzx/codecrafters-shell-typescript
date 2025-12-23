import processExp from "./app/util/processExp";
import processRedirectionOperators from "./app/util/processRedirectionOperator";


let teste = "cd /home";

console.log(processRedirectionOperators(processExp(teste)));