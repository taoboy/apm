/**
 * Created by lenovo on 2017/7/17.
 */
const CommonMiddleware = require("./commonMiddleware");
const webpack = require("webpack");
//const webpackMiddleware = require("webpack-koa2-middleware");
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
const devConfig = require("../website/webpack.dev.config");
const prodConfig = require("../website/webpack.prod.config");
const path = require("path");
const fs = require("fs");

//let prodIndexCache = null;

module.exports = class WebpackMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){
        process.env.NODE_ENV == "production"? prodModel(): devModel();

        function prodModel() {
            //void 0;
            //const compiler = webpack(prodConfig);
            app.use(async (ctx, next)=>{

                if(ctx.method.toUpperCase() == "GET"){
                    switch (ctx.accepts('json', 'html', 'text')) {
                        case 'html':
                            const prodIndexCache = fs.readFileSync(path.resolve(__dirname, '../website/public/bin/index.html'), 'utf8');
                            ctx.set('content-type','text/html');
                            ctx.body = prodIndexCache;
                            break;
                    }
                } else {
                    return next();
                }
            });
        }

        function devModel(){

            const compiler = webpack(devConfig);
            app.use(devMiddleware(compiler, {
                // display no info to console (only warnings and errors)
                noInfo: false,

                // display nothing to the console
                quiet: false,

                // switch into lazy mode
                // that means no watching, but recompilation on every request
                lazy: false,

                // watch options (only lazy: false)
                watchOptions: {
                    aggregateTimeout: 300,
                    poll: true
                },

                hot: true,

                historyApiFallback: true,

                // public path to bind the middleware to
                // use the same as in webpack
                publicPath: "/",

                compress: false,

                index: "index.html",

                // custom headers
                headers: { "X-Custom-Header": "yes" },

                progress: true,

                // options for formating the statistics
                stats: {
                    // Add asset Information
                    //assets: true,
                    //// Sort assets by a field
                    //assetsSort: "field",
                    //// Add information about cached (not built) modules
                    cached: true,
                    //// Show cached assets (setting this to `false` only shows emitted files)
                    cachedAssets: true,
                    //// Add children information
                    children: true,
                    //// Add chunk information (setting this to `false` allows for a less verbose output)
                    //chunks: true,
                    //// Add built modules information to chunk information
                    chunkModules: true,
                    //// Add the origins of chunks and chunk merging info
                    //chunkOrigins: true,
                    //// Sort the chunks by a field
                    //chunksSort: "field",
                    //// Context directory for request shortening
                    //context: "./src/",
                    // `webpack --colors` equivalent
                    colors: true,
                    // Display the distance from the entry point for each module
                    //depth: false,
                    //// Display the entry points with the corresponding bundles
                    //entrypoints: false,
                    // Add errors
                    errors: true,
                    // Add details to errors (like resolving log)
                    errorDetails: true,
                    // Exclude modules which match one of the given strings or regular expressions
                    exclude: [],
                    // Add the hash of the compilation
                    hash: true,
                    // Set the maximum number of modules to be shown
                    //maxModules: Infinity,
                    // Add built modules information
                    modules: true,
                    // Sort the modules by a field
                    //modulesSort: "field",
                    // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
                    moduleTrace: true,
                    // Show performance hint when file size exceeds `performance.maxAssetSize`
                    performance: true,
                    // Show the exports of the modules
                    //providedExports: false,
                    //// Add public path information
                    publicPath: true,
                    //// Add information about the reasons why modules are included
                    //reasons: true,
                    //// Add the source code of modules
                    //source: true,
                    //// Add timing information
                    timings: true,
                    //// Show which exports of a module are used
                    //usedExports: false,
                    //// Add webpack version information
                    version: true,
                    //// Add warnings
                    //warnings: true,
                    //// Filter warnings to be shown (since webpack 2.4.0),
                    //// can be a String, Regexp, a function getting the warning and returning a boolean
                    //// or an Array of a combination of the above. First match wins.
                    //warningsFilter: "filter" | /filter/ | ["filter", /filter/]
                }
            }));

            app.use(hotMiddleware(compiler, {
                // log: console.log,
                // path: '/__webpack_hmr',
                // heartbeat: 10 * 1000
            }));

            app.use(async (ctx, next)=>{
                if(ctx.method.toUpperCase() == "GET"){
                    switch (ctx.accepts('json', 'html', 'text')) {
                        case 'html':
                            const filename = path.resolve(compiler.outputPath, 'index.html');
                            const html = compiler.outputFileSystem.readFileSync(filename, 'utf8');
                            ctx.set('content-type','text/html');
                            ctx.body = html;
                            //ctx.res.end();
                            break;
                        default:
                            ctx.status = 404;
                            ctx.body = "Not Found"
                    }
                } else {
                    return next();
                }
            });

            console.log("中间件:webpack开发模式...[OK]");
        }
    }

};
