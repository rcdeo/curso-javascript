// const pdfjsLib = require('pdfjs-dist');
// const path = require('path');
// pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = '../../dist/pdf.worker.bundle.js';

export class DocumentPreviewController {
    constructor(file) {
        this._file = file;
    }

    getPreviewData() {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            switch (this._file.type) {
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                    reader.onload = (e) => {
                        resolve({
                            src: reader.result,
                            info: this._file.name,
                        });
                    };
                    reader.onerror = (e) => {
                        reject(e);
                    };
                    reader.readAsDataURL(this._file);
                    break;

                case 'application/pdf':
                    reader.onload = (e) => {
                        pdfjsLib
                            .getDocument(new Uint8Array(reader.result))
                            .promise.then((pdf) => {
                                pdf.getPage(1)
                                    .then((page) => {
                                        let viewport = page.getViewport({ scale: 1.0 });
                                        let canvas = document.createElement('canvas');
                                        let canvasContext = canvas.getContext('2d');

                                        canvas.width = viewport.width;
                                        canvas.height = viewport.height;

                                        page.render({
                                            canvasContext,
                                            viewport,
                                        })
                                            .promise.then(() => {
                                                let plural = pdf.numPages > 1 ? 's' : '';
                                                resolve({
                                                    src: canvas.toDataURL('image/png'),
                                                    info: `${pdf.numPages} p\u00E1gina${plural}`,
                                                });
                                            })
                                            .catch((err) => {
                                                reject(err);
                                            });
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    });
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    };
                    reader.readAsArrayBuffer(this._file);
                    break;

                default:
                    reject();
                    break;
            }
        });
    }
}
