/**
 * Created by lenovo on 2017/8/4.
 */
/**
 * Created by lenovo on 2017/7/27.
 */
const CommonService = require("./commonService");
const appidConstruct = require("../utils/appid");
const UUID = require('uuid');

class WebService extends CommonService {
    constructor(){
        super();
    }

    addWebClient (ctx){

        const formData = ctx.request.body;
        const WEBCLIENT = this.db.web_client;

        async function checkWeb(appid = appidConstruct(UUID.v4())) {
            let web = await WEBCLIENT.findOne({where: {appid: appid}});
            if(web){
                appid = appidConstruct(UUID.v4());
                return checkWeb(appid)
            } else {
                return appid;
            }
        }

        return (async ()=>{
            if(formData.name && formData.origin){
                let appid = await checkWeb();
                let web = await WEBCLIENT.create(
                    Object.assign({}, formData, {
                        appid: appid,
                        user_id: ctx.session.user? ctx.session.user.id: null
                    })
                );
                if(web){
                    return {status:　"success"}
                }
            }

            return {status: "failed"}
        })();
    }

    webClient (ctx) {
        return (async() => {
            if (ctx.session.user && ctx.session.user.id) {
                const userId = ctx.session.user.id;
                const params = ctx.request.body;
                const USER = this.db.user;
                const WEBCLIENT = this.db.web_client;

                let {offset = 0, limit = 20} = params;

                //let data = await USER.findOne({
                //    where: {
                //        id: userId
                //    },
                //    include: [
                //        {
                //            model: NODECLIENT,
                //            offset: parseInt(offset),
                //            limit: parseInt(limit)
                //        }
                //    ],
                //    attributes: ['id']
                //});
                let user = await USER.findOne({where: {id: userId}});
                if (user) {
                    let data = await WEBCLIENT.findAndCountAll({
                        where: {
                            user_id: user.id
                        },
                        offset: parseInt(offset),
                        limit: parseInt(limit)
                    });
                    if (data) {
                        return {status: 'success', webClients: data};
                    }
                }
            }
            return {status: "failed"}
        })();
    }

    performance (ctx) {
        const params = ctx.request.body;
                
        let {offset =0 , limit = 13, appid = null} = params;

        return (async ()=>{
            const PERFORMANCE = this.db.web_performance_page;
            const WEBCLIENT = this.db.web_client;
            if(ctx.session.user && ctx.session.user.id) {
                const userId = ctx.session.user.id;
                let result = await PERFORMANCE.findAndCountAll({
                    where: {
                        web_id: appid
                    },
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                    include: [
                        {
                            model: WEBCLIENT,
                            where: {
                                user_id: userId
                            },
                            attributes: ['name']
                        }
                    ]
                });

                return {status: 'success', webPerformance: result};
            }
            return {status: 'failed'};
        })();

    }

    distinctHref(ctx){

        return (async ()=>{
            const params = ctx.request.body;
            const appid = params.appid;

            const Sequelize = this.db.sequelize;
            const WEBPERFORMANCERECORD = this.db.web_performance_page_record;

            let time = params.before;

            let result = await WEBPERFORMANCERECORD.findAll({
                where: {
                    web_id: appid,
                    time_day: time
                },
                attributes: [
                    [Sequelize.literal('DISTINCT(location)'), 'location']
                ]
            });

            return {status: 'success', data: result}
        })();

    }

    analysisPerformancePV(ctx){
        return (async ()=>{
            const params = ctx.request.body;
            const appid = params.appid;
            const location = params.location;

            const dayLimit = params.type != "month";
            const before = params.before ? params.before: new Date().format("yyyy-MM-dd");

            const Sequelize = this.db.sequelize;
            const WEBPERFORMANCERECORD = this.db.web_performance_page_record;

            let result = null, arr = null;
            if(dayLimit){
                result = await WEBPERFORMANCERECORD.findAll({
                    where: {
                        web_id: appid,
                        time_day: before,
                        location: location
                    },
                    attributes: [
                        'count',
                        [Sequelize.col('time_hour'), 'time_hour']
                    ]
                });

                arr = new Array(24);
                for(let i=0; i<arr.length; i++){
                    arr[i] = {
                        count: 0,
                        time: i
                    }
                }
                result.forEach((v)=>{
                    if(v && v.dataValues){
                        arr[parseInt(v.dataValues.time_hour)].count = v.dataValues.count;
                    }
                })

            } else {
                const beforeDateObj = new Date(before);
                const days = new Date(beforeDateObj.getFullYear(), beforeDateObj.getMonth()+1, 0).getDate();
                const after = beforeDateObj.format("yyyy-MM-")+days;
                const Mbefore = beforeDateObj.format("yyyy-MM-")+"01";

                arr = new Array(days);
                let tmp = {}, area = days;

                result = await WEBPERFORMANCERECORD.findAll({
                    where: {
                        web_id: appid,
                        time_day: {
                            $between: [Mbefore, after]
                        },
                        location: location
                    },
                    attributes: [
                        [Sequelize.fn('SUM', Sequelize.col('count')), 'count'],
                        [Sequelize.col('time_day'), 'time_day']
                    ],
                    group: [`time_day`]
                });

                result.forEach((v)=>{
                    if(v && v.dataValues && v.dataValues.time_day){
                        tmp[v.dataValues.time_day] = parseInt(v.dataValues.count);
                    }
                });

                let dayIndex = after;
                while (area > 0){
                    arr[--area] = {
                        time: dayIndex,
                        count: tmp[dayIndex]? tmp[dayIndex]: 0
                    };
                    dayIndex = new Date(new Date(dayIndex) - 24 * 60 * 60 * 1000).format("yyyy-MM-dd");
                }
            }

            return {status: 'success',  result: {
                dateType: dayLimit? 'day': 'month',
                dataArr: arr
            }}
        })();
    }

    analysisPerformancePF(ctx){
        return (async ()=>{
            const params = ctx.request.body;
            const appid = params.appid;
            const location = params.location;

            const dayLimit = params.type != "month";
            const before = params.before ? params.before: new Date().format("yyyy-MM-dd");

            const Sequelize = this.db.sequelize;
            const WEBPERFORMANCERECORD = this.db.web_performance_page_record;

            let result = null, arr = null;
            if(dayLimit){
                result = await WEBPERFORMANCERECORD.findAll({
                    where: {
                        web_id: appid,
                        time_day: before,
                        location: location
                    },
                    attributes: [
                        'id',
                        'min',
                        'min_id',
                        'max',
                        'max_id',
                        'average',
                        'average_id',
                        'time_hour'
                    ]
                });

                arr = new Array(24);
                for(let i=0; i<arr.length; i++){
                    arr[i] = {
                        id: null,
                        min: 0,
                        min_id: null,
                        max: 0,
                        max_id: null,
                        average: 0,
                        average_id: null,
                        time: i
                    }
                }
                result.forEach((v)=>{
                    if(v && v.dataValues){
                        let index = parseInt(v.dataValues.time_hour);
                        arr[index] = v.dataValues;
                        arr[index].time = index;
                    }
                })

            } else {
                const beforeDateObj = new Date(before);
                const days = new Date(beforeDateObj.getFullYear(), beforeDateObj.getMonth()+1, 0).getDate();
                const after = beforeDateObj.format("yyyy-MM-")+days;
                const Mbefore = beforeDateObj.format("yyyy-MM-")+"01";

                arr = new Array(days);
                let tmp = {}, area = days;

                result = await WEBPERFORMANCERECORD.findAll({
                    where: {
                        web_id: appid,
                        time_day: {
                            $between: [Mbefore, after]
                        },
                        location: location
                    },
                    attributes: [
                        [Sequelize.fn('max', Sequelize.col('max')), 'max'],
                        [Sequelize.fn('min', Sequelize.col('min')), 'min'],
                        [Sequelize.fn('avg', Sequelize.col('average')), 'average'],
                        [Sequelize.col('time_day'), 'time_day']
                    ],
                    group: [`time_day`]
                });

                result.forEach((v)=>{
                    if(v && v.dataValues && v.dataValues.time_day){
                        tmp[v.dataValues.time_day] = {
                            max: v.dataValues.max,
                            min: v.dataValues.min,
                            average: parseInt(v.dataValues.average)
                        };
                    }
                });

                let dayIndex = after;
                while (area > 0){
                    arr[--area] = {
                        time: dayIndex,
                        max: tmp[dayIndex]? tmp[dayIndex].max: 0,
                        min: tmp[dayIndex]? tmp[dayIndex].min: 0,
                        average: tmp[dayIndex]? tmp[dayIndex].average: 0
                    };
                    dayIndex = new Date(new Date(dayIndex) - 24 * 60 * 60 * 1000).format("yyyy-MM-dd");
                }
            }

            return {status: 'success',  result: {
                dateType: dayLimit? 'day': 'month',
                dataArr: arr
            }}
        })();
    }

    analysisPFdetail(ctx){
        return (async ()=>{
            const params = ctx.request.body;
            const performanceId = params.pfid;

            const PERFORMANCE = this.db.web_performance_page;
            const WEBENTRIESPAGE = this.db.web_performance_page_entries;

            let result = await PERFORMANCE.findOne({
                where: {
                    id: performanceId
                },
                include: [
                    {
                        model: WEBENTRIESPAGE
                    }
                ]
            });

            if(result){
                return {status: 'success', data: result}
            }
            return {status: 'failed'};
        })();
    }

    exception (ctx){
        const params = ctx.request.body;

        let {offset =0 , limit = 13, appid = null} = params;

        return (async ()=>{
            const WENEXCEPTIONPAGE = this.db.web_exception_page;
            const WEBCLIENT = this.db.web_client;
            if(ctx.session.user && ctx.session.user.id) {
                const userId = ctx.session.user.id;
                let result = await WENEXCEPTIONPAGE.findAndCountAll({
                    where: {
                        web_id: appid
                    },
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                    include: [
                        {
                            model: WEBCLIENT,
                            where: {
                                user_id: userId
                            },
                            attributes: ['name']
                        }
                    ]
                });

                return {status: 'success', webException: result};
            }
            return {status: 'failed'};
        })();
    }

    exceptionDetail(ctx){
        return (async ()=>{
            const params = ctx.request.body;
            const WENEXCEPTIONPAGE = this.db.web_exception_page;
            const WEBEXCEPTIONLOGGER = this.db.web_logger;
            const exceptionId = params.id;
            let result = await WENEXCEPTIONPAGE.findOne({
                where: {
                    id: exceptionId
                },
                include: [
                    {
                        model: WEBEXCEPTIONLOGGER,
                    }
                ]
            });

            return {status: 'success', webExceptionDetail: result};
        })();
    }

    business (ctx){
        const params = ctx.request.body;

        let {offset =0 , limit = 13} = params;

        return (async ()=>{
            const WEBBUSINESSPAGE = this.db.web_business_page;
            const WEBCLIENT = this.db.web_client;
            if(ctx.session.user && ctx.session.user.id) {
                const userId = ctx.session.user.id;
                let result = await WEBBUSINESSPAGE.findAndCountAll({
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                    include: [
                        {
                            model: WEBCLIENT,
                            where: {
                                user_id: userId
                            },
                            attributes: ['name']
                        }
                    ]
                });

                return {status: 'success', webBusiness: result};
            }
            return {status: 'failed'};
        })();
    }

    entries(ctx){
        const params = ctx.request.body;

        let {offset =0 , limit = 13} = params;

        return (async ()=>{
            const PERFORMANCE = this.db.web_performance_page;
            const WEBENTRIESPAGE = this.db.web_performance_page_entries;
            const WEBCLIENT = this.db.web_client;
            if(ctx.session.user && ctx.session.user.id) {
                const userId = ctx.session.user.id;

                let result = await WEBENTRIESPAGE.findAndCountAll({
                    offset:parseInt(offset),
                    limit: parseInt(limit),
                    include: [
                        {
                            model:　PERFORMANCE,
                            include: [
                                {
                                    model: WEBCLIENT,
                                    where: {
                                        user_id: userId
                                    },
                                    attributes: ['name']
                                }
                            ],
                            attributes: ['location_href']
                        }
                    ]
                });

                return {status: 'success', webEntries: result};
            }
            return {status: 'failed'};

        })();
    }
}

module.exports = WebService;