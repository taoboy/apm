/**
 * Created by lenovo on 2017/6/13.
 */
const CommonMiddleware = require("./commonMiddleware");
const onerror = require('koa-onerror');

module.exports = class ErrorMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){

        onerror(app);

        console.log("中间件:错误日志...[OK]");
    }
};
