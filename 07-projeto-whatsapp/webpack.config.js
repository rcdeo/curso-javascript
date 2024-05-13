const webpack = require('webpack');
const path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.mjs',
    },
    mode: 'none',
    output: {
        path: path.join(__dirname, 'dist'),
        // publicPath: 'dist',
        filename: '[name].bundle.js',
    },
    devServer: {
        static: './',
    },
};
