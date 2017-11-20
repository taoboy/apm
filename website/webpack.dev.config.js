const path = require("path");
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config.js');

module.exports = merge(webpackBaseConfig, {
    devtool: 'source-map',
    entry: {
        main: [
            //'eventsource-polyfill', // hot reloading in IE
            //'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000',
            //"webpack-dev-server/client?http://localhost:4430",
            //"webpack/hot/only-dev-server",
            './website/src/main'
        ]
    },
    cache: true,
    output: {
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                //exclude: /node_modules/,
                include: path.join(__dirname, 'src'),
                loaders: [
                    "react-hot-loader/webpack",
                    "babel-loader?presets[]=es2015,presets[]=stage-2,presets[]=react,plugins[]=transform-runtime",
                ]
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'vendors',
        //    filename: 'vendors.js'
        //}),
        // Enables Hot Modules Replacement
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
    ]
});