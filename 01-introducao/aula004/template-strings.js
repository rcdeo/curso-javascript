/**
 * TEMPLATE STRINGS
 *
 * Template strings, também conhecidas como strings literais com acento grave,
 * são uma adição relativamente recente ao JavaScript (ES6) que oferece
 * uma maneira mais flexível e legível de construir strings.
 *
 * Multi-linhas: Diferente das aspas simples e duplas, que forçam você a concatenar
 * várias strings para criar linhas separadas, os template strings usam o caractere
 * de acento grave (`) para envolver o texto, permitindo quebras de linha
 * naturais dentro da string.
 *
 * Interpolação de strings: Você pode incorporar expressões JavaScript diretamente
 * dentro da string usando placeholders delimitados por ${ }. O valor da expressão
 * é então inserido na string final.
 *
 * Tagged templates (opcional): Este recurso avançado permite definir uma função
 * especial que recebe os pedaços da string literal e suas expressões
 * interpoladas separadamente. Isso oferece mais controle para
 * manipular a string dinamicamente.
 */

let numero = 7;
for (let index = 0; index <= 10; index++) {
    console.log(`${index} x ${numero} = ${index * numero}`);
    // console.log(index + ' x ' + numero + ' = ' + index * numero);
}
