const CommonService = require("./commonService");

function camelToLowel(j) {
    if(j.match(/([A-Z])/g)){
        return j.replace(/([A-Z])/g,"_$1").toLowerCase();
    }
    return null;
}

class MonitorService extends CommonService {
    constructor(){
        super();
    }

    auth (ctx){
        const formData = ctx.request.body;
        const host = ctx.host;
        const WEBCLIENT = this.db.web_client;

        const clientAppid = formData.appid;

        return (async ()=>{
            let client = await WEBCLIENT.findOne({where: {appid: clientAppid}});
            if(client){
                return {status: 'success', id: client.id}
            }
            return {status: 'failed'}
        })();
    }

    performanceRecord(performance){
        let webId = performance.web_id;
        let location = performance.location_href;
        let clientTime = performance.client_time;

        let hour = clientTime.getHours();
        let day = clientTime.format("yyyy-MM-dd");

        const WEBPERFORMANCERECORD = this.db.web_performance_page_record;

        return (async ()=>{
            const performanceTiming = parseInt(performance.timing_all);
            let record = await WEBPERFORMANCERECORD.findOne({where: {
                web_id: webId,
                location: location,
                time_day: day,
                time_hour: hour
            }});

            if(!record){
                await WEBPERFORMANCERECORD.create({
                    web_id: webId,
                    location: location,
                    time_day: day,
                    time_hour: hour,
                    min: performanceTiming,
                    min_id: performance.id,
                    max: performanceTiming,
                    max_id: performance.id,
                    average: performanceTiming,
                    //average_id: performance.id
                });
            } else {
                let timeSum = record.average * record.count;
                let average = (timeSum + performanceTiming)/(record.count + 1)
                record.average = parseInt(average);

                if(performanceTiming < record.min){
                    record.min = performanceTiming;
                    record.min_id = performance.id;
                }

                if(performanceTiming > record.max){
                    record.max = performanceTiming;
                    record.max_id = performance.id;
                }

                record.count++;
                timeSum = record.average * record.count;

                if(record.count > 0 && record.count % 20 == 0){
                    let percent5 = parseInt(record.count * 0.05);
                    record.percent_90 = (timeSum - percent5 * (record.min + record.max))/(record.count - percent5*2)
                    if(Math.abs(record.percent_90 - record.average) < record.average * 0.1){
                        record.percent_90_id = performance.id;
                    }
                }

                if(record.count > 0 && record.count % 4 == 0){
                    let percent25 = parseInt(record.count * 0.25);
                    record.percent_50 = (timeSum - percent25 * (record.min + record.max))/(record.count - percent25*2)
                    if(Math.abs(record.percent_50 - record.average) < record.average * 0.1){
                        record.percent_50_id = performance.id;
                    }
                }

                await record.save();
            }
        })()
        //.then(()=>{
        //
        //}).catch((err)=>{
        //    console.error(err);
        //});
    }

    performance (ctx) {

        const formData = ctx.request.body;

        const clientId = formData.id;
        const clientTimeStamp = formData.timeStamp;
        const clientDetail = formData.detail;
        const clientEnvironment = formData.env;

        const timingObj = clientDetail.timingObj;
        const entries = clientDetail.entries;

        const client = clientEnvironment.client;
        const geolocation = clientEnvironment.geolocation;
        const location = clientEnvironment.location;
        const userAgent = clientEnvironment.userAgent;

        let nPerformance_page = {};

        for(let key in client){
            nPerformance_page[`client_${key}`] = client[key];
        }

        ['country', 'province', 'city'].forEach((value)=>{
            nPerformance_page[`geolocation_${value}`] = geolocation[value];
        });

        for(let key in location){
            nPerformance_page[`location_${key}`] = location[key];
        }

        for(let key in timingObj){
            nPerformance_page[`timing_${key}`] = timingObj[key];
        }

        nPerformance_page['user_agent'] = userAgent;
        nPerformance_page['client_time'] = new Date(parseInt(clientTimeStamp));

        nPerformance_page['web_id'] = clientId;

        const PERFORMANCE = this.db.web_performance_page;
        const PERFORMANCE_ENTRIES = this.db.web_performance_page_entries;
        return this.db.sequelize.transaction(async (t)=>{
            let nEntries = [];
            let record = await PERFORMANCE.create(nPerformance_page, {transaction: t});
            const recordId = record.id;

            Object.keys(entries).forEach(i =>{
                let item = entries[i];
                Object.keys(item).forEach((j)=>{
                    if(j.match(/([A-Z])/g)){
                        let cameKey = j.replace(/([A-Z])/g,"_$1").toLowerCase();
                        item[cameKey] = item[j];
                        delete item[j];
                    }
                })
                item['performance_id'] = recordId;
                nEntries.push(item);
            })
            await PERFORMANCE_ENTRIES.bulkCreate(nEntries, {transaction: t});
            //await t.commit();
            this.performanceRecord(record);

            return {status: "success"};
        }).catch((err)=>{
            //t.rollback();
            return {status: "failed", err: err.toString()};
        });

    }

    networdRecord(business) {
        let webId = business.web_id;
        let url = business.business_url;
        let clientTime = business.client_time;

        let hour = clientTime.getHours();
        let day = clientTime.format("yyyy-MM-dd");

        const WEBBUSINESSRECORD = this.db.web_business_page_record;

        return (async() => {
            const businessTime = parseInt(business.business_time);
            let record = await WEBBUSINESSRECORD.findOne({
                where: {
                    web_id: webId,
                    url: url,
                    time_day: day,
                    time_hour: hour
                }
            });

            if (!record) {
                await WEBBUSINESSRECORD.create({
                    web_id: webId,
                    url: url,
                    time_day: day,
                    time_hour: hour,
                    min: businessTime,
                    min_id: business.id,
                    max: businessTime,
                    max_id: business.id,
                    average: businessTime,
                    success_count: business.business_status == 'success'? 1: 0,
                    failed_count: business.business_status == 'success'? 0: 1,
                    //average_id: performance.id
                });
            } else {

                if(business.business_status == 'success'){
                    let timeSum = record.average * record.success_count;
                    let average = (timeSum + businessTime) / (record.success_count + 1)
                    record.average = parseInt(average);
                    if (businessTime < record.min) {
                        record.min = businessTime;
                        record.min_id = business.id;
                    }

                    if (businessTime > record.max) {
                        record.max = businessTime;
                        record.max_id = business.id;
                    }

                    record.success_count++;

                    timeSum = record.average * record.success_count;

                    if (record.success_count > 0 && record.success_count % 20 == 0) {
                        let percent5 = parseInt(record.success_count * 0.05);
                        record.percent_90 = (timeSum - percent5 * (record.min + record.max)) / (record.success_count - percent5 * 2)
                        if (Math.abs(record.percent_90 - record.average) < record.average * 0.1) {
                            record.percent_90_id = business.id;
                        }
                    }

                    if (record.success_count > 0 && record.success_count % 4 == 0) {
                        let percent25 = parseInt(record.success_count * 0.25);
                        record.percent_50 = (timeSum - percent25 * (record.min + record.max)) / (record.success_count - percent25 * 2)
                        if (Math.abs(record.percent_50 - record.average) < record.average * 0.1) {
                            record.percent_50_id = business.id;
                        }
                    }
                } else {
                    record.failed_count++;
                }

                await record.save();
            }
        })()
    }

    network (ctx){
        return (async ()=>{
            const formData = ctx.request.body;

            const client = formData.client;
            const geolocation = formData.geolocation;
            const location = formData.location;
            const userAgent = formData.userAgent;
            const clienTimeStamp = formData.timeStamp;
            const businessObj = formData.business;
            const clientId = formData.id;

            let nBusiness_page = {};

            for(let key in client){
                nBusiness_page[`client_${key}`] = client[key];
            }

            ['country', 'province', 'city'].forEach((value)=>{
                nBusiness_page[`geolocation_${value}`] = geolocation[value];
            });

            for(let key in location){
                nBusiness_page[`location_${key}`] = location[key];
            }

            for(let key in businessObj){
                nBusiness_page[`business_${key}`] = businessObj[key];
            }

            nBusiness_page['user_agent'] = userAgent;
            nBusiness_page['client_time'] = new Date(parseInt(clienTimeStamp));

            nBusiness_page['web_id'] = clientId;

            const BUSINESS = this.db.web_business_page;
            let result = await BUSINESS.create(nBusiness_page);

            this.networdRecord(result);

            return {status: "success"}
        })();
    }

    exception (ctx){
        return (async ()=>{
            const formData = ctx.request.body;

            const clientId = formData.id;
            const clientType = formData.type;
            const clientTimeStamp = formData.timeStamp;
            const clientLogs = formData.logs;
            const clientEnvironment = formData.env;
            const clientDetail = formData.detail;

            const clientInfo = clientEnvironment.client;
            const geolocation = clientEnvironment.geolocation;
            const location = clientEnvironment.location;
            const userAgent = clientEnvironment.userAgent;

            const EXCEPTION = this.db.web_exception_page;
            const WEBLOGGER = this.db.web_logger;

            let nException_page = {};

            for(let key in clientInfo){
                nException_page[`client_${key}`] = clientInfo[key];
            }

            ['country', 'province', 'city'].forEach((value)=>{
                nException_page[`geolocation_${value}`] = geolocation[value];
            });

            for(let key in location){
                nException_page[`location_${key}`] = location[key];
            }

            for(let key in clientDetail){
                nException_page[`exception_${key}`] = clientDetail[key];
            }

            nException_page['user_agent'] = userAgent;
            nException_page['client_time'] = new Date(parseInt(clientTimeStamp));
            nException_page['web_id'] = clientId;

            return this.db.sequelize.transaction(async (t)=>{

                let exception = await EXCEPTION.create(nException_page, {transaction: t});
                const exceptionId = exception.id;

                if(clientLogs && clientLogs.length > 0){

                    let nLogs = [], nLogContent = [];
                    clientLogs.forEach((logger)=>{
                        nLogs.push({
                            client_time: new Date(parseInt(logger.timeStamp)),
                            type: logger.type,
                            info: logger.info,
                            exception_id: exceptionId
                        });
                    });

                    await WEBLOGGER.bulkCreate(nLogs, {transaction: t});

                }
                return {status: "success"};
            }).catch((err)=>{
                //t.rollback();
                return {status: "failed", err: err.toString()};
            });
        })();
    }

}

module.exports = MonitorService;