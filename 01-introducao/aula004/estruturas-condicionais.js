/**
 * ESTRUTURAS CONDICIONAIS EM JAVASCRIPT
 *
 * if: Executa um bloco de código se a condição for verdadeira.
 * else: Executa um bloco de código se a condição do if for falsa.
 * else if: Permite verificar outras condições após um if.
 * switch: Executa um bloco de código específico para cada valor de uma variável.
 *
 * Operador ternário: Uma forma concisa de escrever um if simples.
 */

let cor = 'azul';

if (cor === 'verde') {
    console.log('siga');
} else if (cor === 'amarelo') {
    console.log('atenção');
} else if (cor === 'vermelho') {
    console.log('pare');
} else {
    console.log(cor + ' não corresponde as cores do semáfaro (if else)');
}

switch (cor) {
    case 'verde':
        console.log('siga');
        break;

    case 'amarelo':
        console.log('atenção');
        break;

    case 'vermelho':
        console.log('pare');
        break;

    default:
        console.log(cor + ' não corresponde as cores do semáfaro (switch)');
}
