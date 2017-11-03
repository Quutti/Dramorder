
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NoErrorsPlugin = webpack.NoErrorsPlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const fileName = 'assets/js/[name].js'

const extractComponentCSS = new ExtractTextPlugin('assets/css/component.bundle.css');
const extractGlobalCSS = new ExtractTextPlugin('assets/css/global.bundle.css');

module.exports = function getWebpackConfigs(env = {}) {

    const { production } = env;
    const config = {};

    config.resolve = {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }

    config.entry = {
        app: './src/app/main.tsx'
    }

    config.output = {
        path: path.resolve(__dirname, 'dist'),
        publicPath: production ? '/' : 'http://localhost:8082/',
        filename: fileName
    }

    config.module = {
        rules: [{
            test: /\.(ts|tsx)$/,
            loader: "awesome-typescript-loader",
            exclude: /node_modules/
        }, {
            test: /\.global\.css$/,
            use: extractGlobalCSS.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1, module: true, localIdentName: '[local]' }
                    },
                    'postcss-loader'
                ]
            })
        }, {
            test: /^(.(?!.*(\.global\.css)$))*\.css$/,
            use: extractComponentCSS.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1, module: true, localIdentName: '[name]__[local]___[hash:base64:5]' }
                    },
                    'postcss-loader'
                ]
            })
        }, {
            test: /\.(png|jpg|jpeg|gif|json|svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader'
        }, {
            test: /\.html$/,
            loader: 'raw-loader'
        }]
    }

    config.plugins = [
        new CopyWebpackPlugin([
            { from: "src/public/images/**/*.*", to: "assets/img/[name].[ext]" },
            { from: "node_modules/bootstrap/dist/css/bootstrap.min.css", to: "assets/css/[name].[ext]" },
            { from: "node_modules/font-awesome/css/font-awesome.min.css", to: "assets/css/[name].[ext]" },
            { from: "node_modules/font-awesome/fonts/*.*", to: "assets/fonts/[name].[ext]" },
        ]),

        extractComponentCSS,
        extractGlobalCSS,

        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            inject: 'body'
        })
    ];

    if (production) {
        config.plugins.push(
            new NoErrorsPlugin(),
            new UglifyJsPlugin(),
            new CopyWebpackPlugin([{
                from: __dirname + '/src/public'
            }])
        );
    }

    config.devServer = {
        contentBase: './src/public',
        stats: 'minimal',
        port: 8082
    }

    return config;
}();