export class Format {
    /**
     * Este método converte IDs de elementos HTML em nomes de propriedades em CamelCase, que são utilizados pelo método `loadElements` para carregar os elementos na página.
     *
     * @param {*} text O ID do elemento HTML.
     * @returns {Object} camelCase IDs Um objeto com chaves em CamelCase que correspondem aos IDs dos elementos HTML. O valor associado a cada chave pode ser o próprio elemento HTML ou outras informações relacionadas.
     */
    static getCamelCase(text) {
        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }

    /**
     * Converte milissegundos em uma string de tempo formatada.
     *
     * @param {number} duration A duração em milissegundos.
     * @returns {string} Uma string no formato hh:mm:ss (ou mm:ss se não houver horas).
     */
    static toTime(duration) {
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}
