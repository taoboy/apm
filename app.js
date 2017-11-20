/**
 * Created by lenovo on 2017/7/10.
 */

console.log("------------------------------------------------");
console.log("--------process env is " + process.env.NODE_ENV + " now.---------");
console.log("------------------------------------------------");

const koa       = require("koa");
const config    = require("./config");

const Server    = require("./script/server");
const apm = new Server(new koa(), config);
apm.start();

const TcpServer = require("./script/tcpServer");
const tcp = new TcpServer(config);
tcp.start();