const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');

module.exports = merge(webpackBaseConfig, {
    output: {
        publicPath: '/bin/',
        filename: '[name].[hash:6].js',
        chunkFilename: '[name].[hash:6].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    "babel-loader?presets[]=es2015,presets[]=stage-2,presets[]=react,plugins[]=transform-runtime",
                ]
            },
        ]
    },
    cache: false,
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].[hash:6].css',
            allChunks: true
        }),
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'vendors',
        //    filename: 'vendors.[hash].js'
        //}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
});