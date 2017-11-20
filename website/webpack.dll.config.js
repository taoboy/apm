/**
 * Created by lenovo on 2017/7/20.
 */
const webpack = require('webpack');
const path = require('path');

const vendors = [
    'material-ui',
    'material-ui-icons',
    'react',
    'react-dom',
    'react-router',
    'redux',
    'react-redux',

    //'echarts'
    // ...其它库
];

module.exports = {
    output: {
        path: path.join(__dirname, 'public', 'lib'),
        filename: '[name].dll.js',
        library: '[name]_library',
        libraryTarget: "umd"
    },
    entry: {
        "vendor": vendors,
    },
    plugins: [
        //new webpack.DefinePlugin({
        //    'process.env': {
        //        NODE_ENV: '"production"'
        //    }
        //}),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    }
        //}),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'build', '[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname,
        }),
    ],
};