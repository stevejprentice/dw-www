const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/ts/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dw.js'
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            // {
            //     test: /\.ts/,
            //     use: 'ts-loader',
            //     exclude: path.resolve(__dirname, 'node_modules')
            // },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { 
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            } 
                        },
                        { 
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        } 
                    ]
                })
            },
            {
                test: /\.json/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'data/[name].[ext]'
                        }
                    }
                ]
            }
        ]        
    },
    plugins: [
        new ExtractTextPlugin('dw.css'),
        new HtmlWebpackPlugin({
            title: 'David Wesst',
            filename: 'index.html',
            template: 'src/html/index.html'
        })
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    }
}