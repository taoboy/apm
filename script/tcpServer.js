/**
 * Created by lenovo on 2017/8/14.
 */
const net = require('net');
const nodePerformanceData = require("../model/websocket/node_performance_page");
const JsonSocket = require('./../utils/jsonSocket');
const NodeService = require('../service/nodeService');

class TcpServer {
    constructor(config){
        this.config = config;
        this.server = net.createServer();
        this.nodeService = new NodeService();
    }

    start() {
        const HOST = this.config.ip || '127.0.0.1';
        const PORT = this.config.tcpport || 6969;

        this.server.listen(PORT, HOST);
        this.server.on('connection', (sock)=> {

            console.log('TCP CLIENT CONNECTED FROM: ' + sock.remoteAddress + ':' + sock.remotePort);

            sock = new JsonSocket(sock);
            sock._closed = false;

            sock.on('message', (message)=> {
                switch (message.type){
                    case "id":
                        sock.clientId = message.id;
                        //临时数据
                        nodePerformanceData.setData(sock.clientId, null);
                        sock.sendMessage({status: "success", type: "id"});
                        break;
                    case "system":
                        //临时数据
                        nodePerformanceData.setData(sock.clientId, message.system);
                        break;
                    case "exception":
                        //持久数据
                        this.setException(sock.clientId, message.exception);
                        break;
                    case "error":
                        //持久数据
                        this.setError(sock.clientId, message.error);
                        break;
                    default:
                        console.log(message);
                }
            });

            sock.on('error', function(err) {
                nodePerformanceData.clearData(sock.clientId);
                sock.end();
                sock = null;
            });

            sock.on('close', ()=>{
                console.error("client close");
            });

        }).on('error', (err) => {
            if (err) {
                console.error("----------------tcp server error----------------");
                console.error(err);
            }
            setTimeout(() => {
                this.server.close();
                this.server.listen(PORT, HOST);
            }, 5e3);
        });

        console.log("------------------------------------------------");
        console.log('TCP Server listening on ' + HOST + ':' + PORT);
    }

    setError(id, data){
        this.nodeService.setError({
            id: id,
            data: data
        });
    }

    setException(id, data){
        this.nodeService.setException({
            id: id,
            data: data
        })
    }
}

module.exports = TcpServer;