/**
 * TIPOS DE DADOS EM JAVASCRIPT
 *
 * PRIMITIVOS:
 * String: Sequência de caracteres. Ex: "Olá, mundo!".
 * Number: Números inteiros (int) ou decimais (float*). Ex: 10, 3.14.
 * Boolean: Valores lógicos true ou false.
 * Undefined: Valor não definido. Ex: let x;.
 * Null: Valor nulo intencional. Ex: x = null;.
 * BigInt: Números inteiros grandes. Ex: 12345678901234567890n.
 * Symbol: Valor único e imutável. Ex: Symbol('chave').
 *
 * COMPOSTOS:
 * Object: Coleção de propriedades nomeadas. Ex: {nome: "João", idade: 30}.
 * Array: Lista ordenada de valores (vetor/matriz)*. Ex: [1, 2, 3, "banana"].
 * Function: Bloco de código reutilizável. Ex: function soma(a, b) { return a + b; }.
 *
 * OBSERVACOES:
 * JavaScript e uma linguagem de tipagem dinâmica, o tipo de dado é inferido pelo valor.
 * Os tipos primitivos são imutáveis, enquanto os compostos são mutáveis.
 * Existem outros tipos de dados menos utilizados, como Date e RegExp.
 *
 * Vetor: Array unidimensional, com apenas uma linha ou coluna de dados. Ex: const notas = [10, 8, 7, 5].
 * Matriz: Array multidimensional, com mais de uma dimensão (linhas e colunas). Ex: const tabela = [[1, 2, 3], [4, 5, 6], [7, 8, 9]].
 */

const nome = 'Ana'; // String
const idade = 25; // Number
const isAluno = true; // Boolean
let curso; // Undefined
curso = null; // Null
const bigNumber = 12345678901234567890n; // BigInt
const simbolo = Symbol('chave'); // Symbol
const pessoa = { nome: 'Joao', idade: 30 }; // Object
const frutas = ['banana', 'maca', 'laranja']; // Array
function somar(a, b) {
    return a + b;
} // Function

// Date
const dataAtual = new Date();
console.log(dataAtual); // Exibe a data e hora atual

// Vetor
const verduras = ['alface', 'couve', 'espinafre'];

// Matriz
const tabuleiro = [
    ['X', 'O', 'X'],
    ['O', 'X', 'O'],
    ['X', 'O', 'X'],
];

// RegExp
// Definindo a regex para extrair o nome de usuário
const regexUsuario = /^([^@]+)@.*$/;

// Função para extrair o nome de usuário
function obterUsuario(email) {
    // Verificando se o email é compatível com a regex
    const match = regexUsuario.exec(email);

    // Se o email for válido, retornando o nome de usuário
    if (match) {
        // Converte a primeira letra do nome de usuário para maiúscula
        const usuario = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        return usuario;
    }

    // Se o email for inválido, retornando null
    return null;
}

const email = 'joaosilva@exemplo.com';
const usuario = obterUsuario(email);
console.log(`Nome de usuário: ${usuario}`); // "Joaosilva"
