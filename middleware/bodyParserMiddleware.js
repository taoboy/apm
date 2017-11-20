/**
 * Created by lenovo on 2017/6/13.
 */
const bodyParser     = require('koa-bodyparser');
const CommonMiddleware = require("./commonMiddleware");

module.exports = class BodyParserMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){
        // add bodyParser middleware:
        app.use(bodyParser({
            onerror: function (err, ctx) {
                ctx.throw('body parse error', 422);
            }
        }));
        console.log("中间件:参数解析...[OK]");
    }

};