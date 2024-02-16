/**
 * OPERADORES EM JAVASCRIPT
 *
 * ARITMÉTICOS
 * + : Soma dois números. Ex: x + y = soma de x e y
 * - : Subtrai um número do outro. Ex: x - y = diferença de x e y
 * * : Multiplica dois números. Ex: x * y = produto de x e y
 * / : Divide um número pelo outro. Ex: x / y = divisão de x por y
 * % : Retorna o resto da divisão de dois números. Ex: x % y = resto da divisão de x por y
 * ++: Incrementa o valor de uma variável em 1. Ex: x++ = x + 1
 * --: Decrementa o valor de uma variável em 1. Ex: x-- = x - 1
 *
 * ATRIBUIÇÃO
 * =  : Atribui um valor a uma variável. Ex: x = 10
 * += : Soma um valor a uma variável. Ex: x += 5 = x + 5
 * -= : Subtrai um valor de uma variável. Ex: x -= 5 = x - 5
 * *= : Multiplica um valor por uma variável. Ex: x *= 5 = x * 5
 * /= : Divide uma variável por um valor. Ex: x /= 5 = x / 5
 * %= : Atribui o resto da divisão de dois números a uma variável. Ex: x %= 5 = x % 5
 *
 * COMPARAÇÃO
 * == : Verifica se dois valores são iguais. Ex: x == y
 * != : Verifica se dois valores são diferentes. Ex: x != y
 * ===: Verifica se dois valores são iguais e do mesmo tipo. Ex: x === y
 * !==: Verifica se dois valores são diferentes ou de tipos diferentes. Ex: x !== y
 * <  : Verifica se um valor é menor que outro. Ex: x < y
 * >  : Verifica se um valor é maior que outro. Ex: x > y
 * <= : Verifica se um valor é menor ou igual a outro. Ex: x <= y
 * >= : Verifica se um valor é maior ou igual a outro. Ex: x >= y
 *
 * LÓGICOS
 * &&: Verifica se ambos os valores são verdadeiros. Ex: x && y
 * ||: Verifica se pelo menos um dos valores é verdadeiro. Ex: x || y
 * ! : Inverte o valor lógico de um valor. Ex: !x
 *
 * OUTROS
 * ? : Operador ternário, usado para condicionar um valor. Ex: x > 0 ? "positivo" : "negativo"
 * , : Operador vírgula, usado para separar expressões. Ex: x = 1, y = 2
 * . : Operador de acesso a propriedades, usado para acessar propriedades de objetos. Ex: obj.prop
 * []: Operador de acesso a elementos de array, usado para acessar elementos de arrays. Ex: arr[i]
 * + : Operador de concatenação de strings, usado para concatenar strings. Ex: "a" + "b" = "ab"
 */

let a1 = 10;
const b2 = '10';

console.log(a1 == b2); // true
console.log(a1 === b2); // false
console.log(a1 != b2); // false

console.log(a1 == b2 && typeof b2 == 'string'); // true
console.log(a1 == b2 && typeof a1 == 'string'); // false
console.log(a1 == b2 || typeof a1 == 'string'); // true
