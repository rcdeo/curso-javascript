/**
 * LAÇOS DE REPETIÇÃO EM JAVASCRIPT
 *
 * for: Executa um bloco de código um número definido de vezes.
 * while: Executa um bloco de código enquanto uma condição for verdadeira.
 * do...while: Executa um bloco de código pelo menos uma vez e depois repete enquanto uma condição for verdadeira.
 * for...in: Itera sobre as propriedades de um objeto.
 * for...of: Itera sobre os valores de um objeto iterável (array, string, etc.).
 * forEach: Itera sobre os elementos de um array e executa uma função para cada elemento.
 * map: Itera sobre os elementos de um array e retorna um novo array com os resultados da função aplicada a cada elemento.
 * filter: Itera sobre os elementos de um array e retorna um novo array com os elementos que satisfazem a condição da função.
 * reduce: Itera sobre os elementos de um array e acumula um valor final.
 * some: Verifica se pelo menos um elemento de um array satisfaz a condição da função.
 * every: Verifica se todos os elementos de um array satisfazem a condição da função.
 *
 * break: Sai do laço de repetição, enquanto
 * continue: pula para a próxima iteração (volta).
 */

// for
for (let ex1 = 0; ex1 < 5; ex1++) {
    console.log(ex1 + ' for'); // 0, 1, 2, 3, 4
}

// while
let ex2 = 0;
while (ex2 < 5) {
    console.log(ex2 + ' while'); // 0, 1, 2, 3, 4
    ex2++;
}

// do...while
let ex3 = 0;
do {
    console.log(ex3 + ' do while'); // 0, 1, 2, 3, 4
    ex3++;
} while (ex3 < 5);

// for...in
const ex4 = { a: 1, b: 2, c: 3 };
for (const prop in ex4) {
    console.log(prop + ' for...in'); // "a", "b", "c"
}

// for...of
const ex5 = [1, 2, 3];
for (const num of ex5) {
    console.log(num + ' for...of'); // 1, 2, 3
}

// forEach
const ex6 = [1, 2, 3];
ex6.forEach((num) => console.log(num + ' forEach')); // 1, 2, 3

// map
const ex7 = [1, 2, 3];
const newArr = ex7.map((num) => num * 2); // [2, 4, 6]
console.log(newArr);

// filter
const ex8 = [1, 2, 3];
const filteredArr = ex8.filter((num) => num % 2 === 0); // [2]
console.log(filteredArr);

// reduce
const ex9 = [1, 2, 3];
const sum = ex9.reduce((acc, num) => acc + num, 0); // 6
console.log(sum);

// some
const ex10 = [1, 2, 3];
const isEven = ex10.some((num) => num % 2 === 0); // true
console.log(isEven);

// every
const ex11 = [1, 2, 3];
const isEven1 = ex11.every((num) => num % 2 === 0); // false
console.log(isEven1);
