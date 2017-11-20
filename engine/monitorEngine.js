/**
 * Created by lenovo on 2017/6/14.
 */
const http = require('http');
const socketIO = require('socket.io');
const SocketServer = require('./../script/socketServer');

class MonitorEngine {
    constructor () {
    }

    load(app){
        const server = http.createServer(app.callback());
        const socketServer = new SocketServer(socketIO(server));
        return server;
    }
}

module.exports = MonitorEngine;