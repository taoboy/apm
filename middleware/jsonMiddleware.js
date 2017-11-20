/**
 * Created by lenovo on 2017/6/13.
 */
const json           = require('koa-json');
const CommonMiddleware = require("./commonMiddleware");

module.exports = class JsonMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){
        app.use(json());
        console.log("中间件:json...[OK]");
    }

};