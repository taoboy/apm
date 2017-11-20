/**
 * Created by lenovo on 2017/6/13.
 */
const compress       = require('koa-compress');
const CommonMiddleware = require("./commonMiddleware");

module.exports = class CompressMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){
        app.use(compress({
            //filter: function (content_type) {
            //    return /text/i.test(content_type)
            //},
            threshold: 2048,
            flush: require('zlib').Z_SYNC_FLUSH
        }));
        console.log("中间件:压缩...[OK]");
    }

};