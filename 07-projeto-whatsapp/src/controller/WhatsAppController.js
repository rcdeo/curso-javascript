class WhatsAppController {
    constructor() {
        console.log('WhatsAppController');

        this.loadElements();
    }

    /**
     * Selecionar os elementos DOM pelo ID e armazenar uma referência a eles na
     * propriedade el do objeto WhatsAppController.
     */
    loadElements() {
        this.el = {};
        document.querySelectorAll('[id]').forEach((element) => {
            this.el[Format.getCamelCase(element.id)] = element;
        });
    }
}
