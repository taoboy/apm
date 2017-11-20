/**
 * Created by lenovo on 2017/8/14.
 */
const nodePerformanceData = require("../model/websocket/node_performance_page");

class SocketServer {
    constructor(io){

        io.on('connection', (socket) => {
            let _index = "default";
            let _pageTimer = {};

            socket.on('init', (nodeId)=> {
                _index = nodeId;

                if(Object.keys(_pageTimer).length){
                    for(let timer in _pageTimer){
                        clearInterval(timer)
                    }
                }

                let data = nodePerformanceData.getData(_index);
                //if(!data)nodePerformanceData.setData(_index, null);
                socket.emit('start', data)
            });

            socket.on('stats', ()=> {
                nodePerformanceData.getData(_index).forEach((span) => {
                    //if(interval)clearInterval(interval);
                    let timer = _pageTimer[`${_index}_timer_${span.interval}`];
                    if(timer){
                        //console.log(`timer already exist ${_index}_timer_${span.interval}`);
                        return;
                    }
                    _pageTimer[`${_index}_timer_${span.interval}`] = setInterval(() => {
                        let data = nodePerformanceData.getData(_index);
                        socket.emit('stats', data? data[span.interval]: null)
                    }, span.interval * 1000);
                    //interval.unref()
                });
            });

            socket.on('change', ()=> {
                socket.emit('start', nodePerformanceData.getData(_index))
            });

            socket.on('disconnect', ()=>{
                console.log("disconnect");
                //clearInterval(pageTimer[`${_index}_timer_${span.interval}`]);
            });
        });

        return io;

    }
}

module.exports = SocketServer;