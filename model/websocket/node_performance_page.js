/**
 * Created by lenovo on 2017/8/14.
 */
const cacheData = {};
cacheData["default"] = [];
cacheData["default"][1] = { interval: 1, retention: 60};
cacheData["default"][5] = { interval: 5, retention: 60};
cacheData["default"][15] = { interval: 15, retention: 60};
cacheData["default"].forEach((span) => {
    span.os = {
        cpu: 0,
        memory: 0,
        load: [ 0, 0, 0 ],
        timestamp: 0
    };
    span.responses = {
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        count: 0,
        mean: 0,
        timestamp: 0
    };
    //const interval = setInterval(() => gatherOsMetrics(io, span), span.interval * 1000)
    //interval.unref()
});

module.exports = {
    getData: (id)=>{
        return cacheData[id];
    },
    setData: (id, data)=>{
        if(!cacheData[id])cacheData[id] = cacheData['default'];
        if(data){
            let responses = cacheData[id][data.interval].responses;
            if(responses && (data.responses.timestamp - responses.timestamp)/1000 < data.interval){
                if(data.responses.count && data.responses.count > 0){
                    [2,3,4,5].forEach((i)=>{
                        responses[i] = + data.responses[i];
                    });
                    responses.mean = Math.round((responses.mean * responses.count + data.responses.mean * data.responses.count)/(responses.count + data.responses.count))*100/100 || 0;
                    responses.count = + data.responses.count;
                }
            } else {
                cacheData[id][data.interval] = data;
            }
        }
    },
    clearData: (id)=>{
        delete cacheData[id];
    }
};