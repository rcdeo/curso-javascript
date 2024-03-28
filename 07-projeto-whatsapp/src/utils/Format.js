class Format {
    /**
     * Este método é usado pelo método `loadElements` para converter os IDs dos
     * elementos em nomes de propriedades em camelCase.
     */
    static getCamelCase(text) {
        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }
}
