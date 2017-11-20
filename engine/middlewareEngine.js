/**
 * Created by lenovo on 2017/6/14.
 */
const WebpackMiddleware = require("../middleware/webpackMiddleware");
const ErrorMiddleware = require("../middleware/errorMiddleware");
const LoggerMiddleware = require("../middleware/loggerMiddleware");
const SessionMiddleware = require("../middleware/sessionMiddleware");
const BodyParserMiddleware = require("../middleware/bodyParserMiddleware");
const CompressMiddleware = require("../middleware/compressMiddleware");
const StaticServerMiddleware = require("../middleware/staticServerMiddleware");
//const UserAgentMiddleware = require("../middleware/userAgentMiddleware");
//const InterceptMiddleware = require("../middleware/interceptMiddleware");
const JsonMiddleware = require("../middleware/jsonMiddleware");
const RouteMiddleware = require("../middleware/routeMiddleware");


module.exports = class MiddlewareEngine {
    constructor () {
        this.webpackMiddleware = new WebpackMiddleware();
        this.errorMiddleware = new ErrorMiddleware();
        this.loggerMiddleware = new LoggerMiddleware();
        this.sessionMiddleware = new SessionMiddleware();
        this.bodyParserMiddleware = new BodyParserMiddleware();
        this.compressMiddleware = new CompressMiddleware();
        this.staticServerMiddleware = new StaticServerMiddleware();
        //this.userAgentMiddleware = new UserAgentMiddleware();
        //this.interceptMiddleware = new InterceptMiddleware();
        this.jsonMiddleware = new JsonMiddleware();
        this.routeMiddleware = new RouteMiddleware();
    }

    load(app){
        this.staticServerMiddleware.load(app);
        this.webpackMiddleware.load(app);
        this.errorMiddleware.load(app);
        this.loggerMiddleware.load(app);
        this.sessionMiddleware.load(app);
        this.bodyParserMiddleware.load(app);
        this.compressMiddleware.load(app);
        //this.userAgentMiddleware.load(app);
        //this.interceptMiddleware.load(app);
        this.jsonMiddleware.load(app);
        this.routeMiddleware.load(app);
    }
}