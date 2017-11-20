/**
 * Created by lenovo on 2017/6/13.
 */
const logger  = require("koa-logger");
const CommonMiddleware = require("./commonMiddleware");

module.exports = class LoggerMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){
        process.env.NODE_ENV == "production"? void(0): app.use(logger());
        console.log("中间件:打印...[OK]");

    }

};