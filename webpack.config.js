/**
 *
 * Webpack Config
 *
 * * * * * * * * * * * * * * * * *
 * @author: Alberto Naperi Jr.   *
 * * * * * * * * * * * * * * * * *
 *
 **/

var nodeExternals = require('webpack-node-externals');
var NodemonPlugin = require('nodemon-webpack-plugin');
var path = require('path');
// var webpack = require('webpack');

module.exports = {
    target: 'node', // webworker | node-webkit
    entry: {
        app: path.resolve('src/Main.ts')
    },
    output: {
        filename: 'main.bundle.js',
        path: path.resolve('dist/server'),
        publicPath: '/'
    },
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [
            path.resolve('.'),
            path.resolve('node_modules')
        ]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader'
        }]
    },
    plugins: [
        new NodemonPlugin({
            script: path.resolve('bin/index')
        }), // Run nodemon server
    ]
};