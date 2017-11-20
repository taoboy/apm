const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: './website/src/main'
    },
    output: {
        path: path.join(__dirname, 'public', 'bin')
        //libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'autoprefixer-loader']
                })
            },

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader?minimize', 'sass-loader']
                })
            },

            {
                test: /\.sass/,
                use: ExtractTextPlugin.extract({
                    use: ['autoprefixer-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },

            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".jsx"],
        // 添加前端引用库路径 例：var $ = require("node_modules/zepto");
        alias: {
            // node_modules: path.resolve(process.cwd(), "node_modules"),
            // custom: path.resolve(process.cwd(), "node_modules/lodash/index.js")
            // zepto: path.resolve(process.cwd(), "web_client/src/libs/zepto.min.js")
        },
        //modulesDirectories: ["node_modules", "spritesmith-generated"]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        //"react": "React",
        //"react-dom": "ReactDOM",
        // "jquery": "jquery",
        // "redux": "redux",
        // "react-redux": "react-redux",
        // "lodash": "custom"
    },
    plugins: [
        // clean dist plugin
        new CleanWebpackPlugin(['./website/public/bin'], {
            root: path.resolve(process.cwd()),
            verbose: false,
            dry: false,
            exclude: []
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './website/src/template/index.ejs',
            inject: false
        }),

        // banner tag
        new webpack.BannerPlugin("yyfax-apm"),

        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./build/vendor-manifest.json')
        }),

        //new ExtractTextPlugin('style.css')
    ]
};