/**
 * Carimbo de data/hora Unix, em português, é um sistema de numeração usado para
 * representar o tempo decorrido desde 1º de janeiro de 1970 à 00:00:00 GMT,
 * medido em segundos.
 */

let dataHoraUnix = Date.now(); // Unix Time Stamp
console.log(dataHoraUnix);

let dataHora = new Date();
console.log(dataHora);
console.log(dataHora.getDate());
console.log(dataHora.getMonth());
console.log(dataHora.getFullYear());
console.log(dataHora.toLocaleDateString('pt-BR'));
