/**
 * Created by lenovo on 2017/6/13.
 */
const CommonMiddleware = require("./commonMiddleware");

module.exports = class UserAgentMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){
        app.use(async(ctx, next) => {
            let defaultUserAgent = {
                isIE: false
            };

            let ua = ctx.req.headers['user-agent'].toLowerCase() || '';

            ua.match(/msie ([\d.]+)/)? defaultUserAgent.isIE = true:
                ua.match(/rv:([\d.]+)\) like gecko/)? defaultUserAgent.isIE = true:
                    null;


            ctx.userAgent = defaultUserAgent;

            return next();
        });

        console.log("中间件:UA...[OK]");
    }

};