let carros = ['Palio', 'Toro', 'Uno', 10, true, new Date(), function () {}];

console.log(carros);
console.log(carros.length); // 7
console.log(carros[2]); // Uno
console.log(carros[5].getFullYear()); // 2024
console.log(carros[6]()); // Undefined

// forEach
let legumes = [
    'abobrinha',
    'berinjela',
    'pepino',
    'abóbora',
    'chuchu',
    'pimentão',
    'etc',
];

// opção 1
legumes.forEach(function (value, index) {
    console.log(index, value);
});

// opção 2
legumes.forEach((value, index) => console.log(index, value));
