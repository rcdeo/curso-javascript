class CalcController {
    constructor() {
        this._displayCalc = '0';
        this._currentDate;
        this.initialize();
    }

    initialize() {
        let displayCalcEl = document.querySelector('#display');
        let dateEl = document.querySelector('#data');
        let timeEl = document.querySelector('#hora');

        displayCalcEl.innerHTML = '1000';
        dateEl.innerHTML = '25/09/2024';
        timeEl.innerHTML = '18:10';
    }

    get displayCalc() {
        return this._displayCalc;
    }

    set displayCalc(valor) {
        this._displayCalc = valor;
    }

    get currentDate() {
        return this._currentDate;
    }

    set currentDate(valor) {
        this._currentDate = valor;
    }
}
