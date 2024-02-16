/**
 * @param {number} x1
 * @param {number} x2
 * @param {string} operador
 */

// Function
function calc(x1, x2, operador) {
    return eval(`${x1} ${operador} ${x2}`);
}
let resultado = calc(10, 2, '-');
console.log(resultado);

// Anonymous Function
(function (x1, x2, operador) {
    const opcao1 = eval(`${x1} ${operador} ${x2}`);
    console.log(opcao1);
})(10, 2, '*');

const opcao2 = (function (x1, x2, operador) {
    return eval(`${x1} ${operador} ${x2}`);
})(10, 2, '/');
console.log(opcao2);

// Arrow Function
let calc2 = (
    /** @type {number} */ x1,
    /** @type {number} */ x2,
    /** @type {string} */ operador
) => {
    return eval(`${x1} ${operador} ${x2}`);
};
let resultado2 = calc2(10, 2, '+');
console.log(resultado2);
