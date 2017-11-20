/**
 * Created by lenovo on 2017/4/5.
 */

global.CONFIG = require("../config");
global.SYSTEMNAME = require("../config").name;
global.SESSION    = require("../config").session;

const MiddlewareEngine = require("../engine/middlewareEngine");
const ServiceEngine = require("../engine/serviceEngine");
const ExceptionEngine = require("../engine/exceptionEngine");
const MonitorEngine = require("../engine/monitorEngine");

const getRepoInfo = require('git-repo-info');

class Server {

    constructor (app, config){
        //global.CONFIG = config;
        this.app = app;
        this.httpServer = this.app;
        this.tcpServer = null;
        this.exceptionEngine = new ExceptionEngine();
        this.middlewareEngine = new MiddlewareEngine();
        this.serviceEngine = new ServiceEngine();
        this.monitorEngine = new MonitorEngine();


        this.loadExceptionCatcher();
        this.loadMiddleware();
        this.loadService();
        this.loadMonitor();
    }

    loadMiddleware (){
        console.log("------------------------------------------------");
        console.log("初始化中间件...[开始]");
        this.middlewareEngine.load(this.app);
        console.log("初始化中间件...[OK]");
    }

    loadService (){
        console.log("------------------------------------------------");
        console.log("初始化公共服务模块...[开始]");
        this.serviceEngine.load(this.app);
        console.log("初始化公共服务模块...[OK]");
    }

    loadMonitor (){
        console.log("------------------------------------------------");
        console.log("初始化监控模块...[开始]");
        this.httpServer = this.monitorEngine.load(this.app);
        console.log("初始化监控模块...[OK]");
    }

    loadExceptionCatcher(){
        console.log("------------------------------------------------");
        console.log("初始化异常捕获模块...[开始]");
        this.exceptionEngine.load();
        console.log("初始化异常捕获模块...[OK]");
    }


    start (){
        let info = getRepoInfo();
        this.httpServer.listen(CONFIG.port, () => {
            console.log("------------------------------------------------");
            console.log(`node: ${CONFIG.name}`);
            console.log(`time: ${new Date()}`);
            console.log(`port: ${CONFIG.port}`);
            console.log(`branch: ${info.branch}`);
            console.log("------------------------------------------------");
        });
    }
};


module.exports = Server;