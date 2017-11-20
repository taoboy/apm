/**
 * Created by lenovo on 2017/6/13.
 */

const staticServer   = require('koa-static');
const path           = require('path');
const CommonMiddleware = require("./commonMiddleware");

module.exports = class StaticServerMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){
        app.use(staticServer(path.resolve(__dirname, '..', 'website', 'public'), {
            maxage: 7*24*60*60*1e3
        }));

        console.log("中间件:静态资源...[OK]");
    }

};