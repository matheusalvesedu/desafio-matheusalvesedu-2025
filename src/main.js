import { AbrigoAnimais } from "./abrigo-animais.js";

// criar instância do abrigo
const abrigo = new AbrigoAnimais();


console.log(abrigo.encontraPessoas('RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo'));
console.log(abrigo.encontraPessoas('BOLA,LASER', 'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola'));