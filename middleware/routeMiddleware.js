/**
 * Created by lenovo on 2017/6/13.
 */
const Router = require('koa-router');
const debug = require("debug")("yyfax:route");
const path = require("path");
const fs = require("fs");
const UrlUtil = require('url');

const CommonMiddleware = require("./commonMiddleware");
const ServiceEngine = require("../engine/serviceEngine");


class PageRoute {
    constructor(){
        this.router = new Router();
        //this.indexRoute();
        //this.initRoute();
        return this.router;
    }

    indexRoute(){
        this.router.get("/", async (ctx, next) => {
            ctx.body = {status: "success"}
        });
    }

    initRoute(_routePath = "route") {
        let self = this;
        let files = fs.readdirSync(path.resolve(__dirname, "..", _routePath));
        let jsFiles = files.filter((f) => {
            return f.endsWith('.js') && !f.includes("index.js");
        });

        //加载页面路由
        for (let f of jsFiles) {
            let prefix = f.split(".")[0];
            let methods = ["get", "post", "del", "put", "all"];
            //let methods = ['get'];
            let handlers = {};
            methods.forEach((method) => {
                handlers[method] = (_url, _handler) => {
                    self.router[method](`/${prefix}${_url}`, _handler);
                }
            });

            require(path.resolve(__dirname, "..", _routePath, f))(handlers);
            console.log(`路由: ${prefix}...[OK]`);
            //let mapping = require(path.resolve(__dirname, "..", _routePath, f))(handlers);
            //addMapping(_router, mapping);
        }

    }
}


class ServiceRoute {
    constructor(){
        this.router = new Router();
        this.serviceEngine = new ServiceEngine();
        this.initRoute();

        return this.router;
    }

    initRoute(){
        //test monitor API
        this.router.post("/api/frontEnd/yyfaxapm/monitor.action", async (ctx, next)=>{
            ctx.set('Access-Control-Allow-Origin', "*");

            let parseUri = UrlUtil.parse(ctx.url), fileType;
            let pathName = parseUri.pathname;
            let file = /\.([^\.]+)$/.exec(pathName);
            if (file) {
                fileType = file[1] || '';
            }
            if (fileType === 'action' && parseUri.query) {
                //this.ctx = ctx;
                //let service = this.serviceEngine.handle(ctx.params.module);
                if(ctx.query.fn){
                    let service = this.serviceEngine.handle("monitor");
                    if(typeof service[ctx.query.fn] == "function"){

                        let data = await service[ctx.query.fn](ctx).then(data => {
                            return data;
                        }).catch(err => {
                            return {status: 'failed', err: err.toString()}
                        });

                        ctx.body = data;
                        ctx.status = 200;
                        return;
                    }
                }
            }
            ctx.body = "Request Error";
            ctx.status = 500;
            //if(ctx.params.module && ctx.query.fn){}
        });

        this.router.all("/api/frontEnd/yyfaxapm/:module.action", async (ctx, next)=>{

            let parseUri = UrlUtil.parse(ctx.url), fileType;
            let pathName = parseUri.pathname;
            let file = /\.([^\.]+)$/.exec(pathName);
            if (file) {
                fileType = file[1] || '';
            }
            if (fileType === 'action' && parseUri.query) {
                //this.ctx = ctx;
                //let service = this.serviceEngine.handle(ctx.params.module);
                if(ctx.params.module && ctx.query.fn){
                    let service = this.serviceEngine.handle(ctx.params.module);
                    if(typeof service[ctx.query.fn] == "function"){

                        let data = await service[ctx.query.fn](ctx).then(data => {
                            return data;
                        }).catch(err => {
                            console.error(err);
                            return {status: 'failed', err: err.toString()}
                        });

                        ctx.body = data;
                        ctx.status = 200;
                        return;
                    }
                }
            }
            ctx.body = "Request Error";
            ctx.status = 500;
        });


    }
}

module.exports = class RouteMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){

        let pageRoute = new PageRoute();
        app.use(pageRoute.routes(), pageRoute.allowedMethods());

        let serviceRoute = new ServiceRoute();
        app.use(serviceRoute.routes(), serviceRoute.allowedMethods());

        //app.use((ctx) => {
        //    if(ctx.status == 404) ctx.render('404');
        //});

        console.log("中间件：路由...[OK]");
    }

};