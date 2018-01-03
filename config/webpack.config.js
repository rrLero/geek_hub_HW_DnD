const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        extensions: [
            '.less',
            '.js'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: path.resolve()
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            }
        ]
    }
};