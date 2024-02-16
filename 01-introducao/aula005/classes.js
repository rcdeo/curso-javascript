/**
 * Orientação a Objetos
 *
 * A classe irá englobar todos os assuntos em comum.
 * Uma classes é um conjunto de atributos/proprieades (variáveis - dados) e métodos (funções).
 * Instância é quando o objeto representa uma classe.
 */

// Exemplo 1
// let celular = function () {
//     let cor = 'prata';
// };
// let objeto = new celular();
// console.log(objeto);

// Exemplo 2
// let celular = function () {
//     this.cor = 'prata';
//     this.ligar = function () {
//         console.log('iniciando uma ligação');
//         return 'ligando';
//     };
// };
// let objeto = new celular();
// console.log(objeto.cor);
// console.log(objeto.ligar());

// Exemplo 3
class celular {
    constructor() {
        this.cor = 'prata';
    }
    ligar() {
        console.log('iniciando uma ligação');
        return 'ligando';
    }
}

let objeto = new celular();
console.log(objeto);
console.log(objeto.cor);
console.log(objeto.ligar());
