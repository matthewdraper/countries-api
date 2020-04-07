const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const isDevelopment = process.env.NODE_ENV === 'isDevelopment';

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.join(__dirname, '/webroot/js/bundle'),
        filename: 'index.bundle.js'
    },
    devServer: {
        inline: true,
        port: 8001
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './webroot/index.html'
        }),
    ]
}
