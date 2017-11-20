/**
 * Created by lenovo on 2017/8/4.
 */
/**
 * Created by lenovo on 2017/7/27.
 */
const CommonService = require("./commonService");
const appidConstruct = require("../utils/appid");
const UUID = require('uuid');

class NodeService extends CommonService {
    constructor(){
        super();
    }

    addNodeClient (ctx){

        const formData = ctx.request.body;
        const NODECLIENT = this.db.node_client;

        async function checkNode(appid = appidConstruct(UUID.v4())) {
            let node = await NODECLIENT.findOne({where: {appid: appid}});
            if(node){
                appid = appidConstruct(UUID.v4());
                return checkNode(appid)
            } else {
                return appid;
            }
        }

        return (async ()=>{
            if(formData.name && formData.struct){
                let appid = await checkNode();
                let node = await NODECLIENT.create(
                    Object.assign({}, formData, {
                        appid: appid,
                        user_id: ctx.session.user? ctx.session.user.id: null
                    })
                );
                if(node){
                    return {status:　"success"}
                }
            }

            return {status: "failed"}
        })();
    }

    nodeClient (ctx){
        return (async ()=>{
            if(ctx.session.user && ctx.session.user.id){
                const userId = ctx.session.user.id;
                const params = ctx.request.body;
                const USER = this.db.user;
                const NODECLIENT = this.db.node_client;

                let {offset =0 , limit = 20} = params;

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
                if(user){
                    let data = await NODECLIENT.findAndCountAll({
                        where: {
                            user_id: user.id
                        },
                        offset: parseInt(offset),
                        limit: parseInt(limit)
                    });
                    if(data){
                        return {status: 'success', nodeClients: data};
                    }
                }
            }
            return {status: "failed"}
        })();
    }

    authClient (ctx){
        return (async ()=>{
            const formData = ctx.request.body;
            const NODECLIENT = this.db.node_client;

            if(formData.appid){
                let node = await NODECLIENT.findOne({where: {appid: formData.appid}});
                if(node){
                    if(formData.version && node.version != formData.version){
                        node.version = formData.version;
                        await node.save();
                    }
                    return {
                        status: "success",
                        node: node,
                        ip: CONFIG.ip,
                        port: 6969
                    }
                }
            }

            return {status: "failed"}
        })();
    }

    setError ({id, data}){
        const NODEERRORPAGE = this.db.node_error_page;
        const nError = {
            node_id: id,
            client_time: new Date(parseInt(data.time)),
            url: data.url,
            message: data.message,
            stack: data.stack,
            host: data.host,
            browser_name: data.getBrowser.name,
            browser_version: data.getBrowser.version,
            cookie: data.cookie
        };
        return (async ()=>{
            await NODEERRORPAGE.create(nError);
            return {status: 'success'}
        })();
    }

    error (ctx){
        const params = ctx.request.body;

        let {offset =0 , limit = 20, appid = null} = params;

        return (async ()=>{
            const NODEERRORPAGE = this.db.node_error_page;
            const NODECLIENT = this.db.node_client;
            if(ctx.session.user && ctx.session.user.id) {
                const userId = ctx.session.user.id;
                let result = await NODEERRORPAGE.findAndCountAll({
                    where: {
                        node_id: appid
                    },
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                    include: [
                        {
                            model: NODECLIENT,
                            where: {
                                user_id: userId
                            },
                            attributes: ['name']
                        }
                    ]
                });
                return {status: 'success', nodeError: result};
            }
            return {status: 'failed'};
        })();
    }

    errorAnalysis (ctx){
        const params = ctx.request.body;

        return (async ()=>{
            const NODEERRORPAGE = this.db.node_error_page;
            const NODECLIENT = this.db.node_client;
            const Sequelize = this.db.sequelize;

            const appid = params.appid;
            const dayLimit = params.type != "month";

            let before = parseInt(params.before);
            let after = parseInt(params.after);

            const parseTime = (time)=>{
                return new Date(new Date(time).format("yyyy-MM")+"-01 00:00:00").getTime()
            }


            if(dayLimit){
                before = before? before: new Date(new Date().format("yyyy-MM-dd")+" 00:00:00").getTime();
                after = before + 24 * 60 * 60 * 1000;
            } else {
                before = before? parseTime(before): parseTime();
                let days = new Date(new Date(before).getFullYear(), new Date(before).getMonth()+1, 0).getDate();
                after = before + days * 24 * 60 * 60 * 1000 - 1e3;
            }

            //const before = params.before? parseInt(params.before): new Date(new Date().format("yyyy-MM-dd")+" 00:00:00").getTime();
            //const after = dayLimit ? before + 86399000 : (params.after? parseInt(params.after): (new Date(before).getMonth()+1));

            let result = await NODEERRORPAGE.findAll({
                where: {
                    node_id: appid,
                    client_time: {
                        $between: [new Date(before), new Date(after)]
                    }
                },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                    dayLimit ?
                        [Sequelize.fn('DATE_FORMAT', Sequelize.col('client_time'), "%Y-%m-%d %H"), 'date']
                        :
                        [Sequelize.fn('DATE_FORMAT', Sequelize.col('client_time'), "%Y-%m-%d"), 'date'],
                ],
                group: [
                    `date`
                ]
            });

            let arr = null;

            if(result){
                if(dayLimit){
                    arr = new Array(24);
                    for(let i=0; i<arr.length; i++){
                        arr[i] = {
                            count: 0,
                            time: i
                        }
                    }
                    result.forEach((v)=>{
                        if(v && v.dataValues){
                            let index = parseInt(v.dataValues.date.slice(-2));
                            arr[index].count = v.dataValues.count;
                        }
                    })
                } else {
                    let area = parseInt((after - before + 1e3)/86400000), lastDay = new Date(after);
                    let tmp = {};
                    area > 100? area = 100: null;
                    arr = new Array(area);

                    result.forEach((v)=>{
                        if(v && v.dataValues && v.dataValues.date){
                            tmp[v.dataValues.date] = v.dataValues.count;
                        }
                    })

                    while (area > 0){
                        let dayIndex = lastDay.format("yyyy-MM-dd")

                        arr[--area] = {
                            time: dayIndex,
                            count: tmp[dayIndex]? tmp[dayIndex]: 0
                        }

                        lastDay = new Date(lastDay - 24 * 60 * 60 * 1000);
                    }
                }
            }

            return {status: 'success', result: {
                dateType: dayLimit? 'day': 'month',
                dataArr: arr
            }}

        })();
    }

    setException ({id, data}){
        const NODEEXCEPTIONPAGE = this.db.node_exception_page;
        const nException = {
            node_id: id,
            client_time: new Date(parseInt(data.time)),
            url: data.url,
            type: data.type,
            message: data.message,
            stack: data.stack
        };
        return (async ()=>{
            await NODEEXCEPTIONPAGE.create(nException);
            return {status: 'success'}
        })();
    }

    exception (ctx){
        const params = ctx.request.body;

        let {offset =0, limit = 20, appid = null} = params;

        return (async ()=>{
            const NODEEXCEPTIONPAGE = this.db.node_exception_page;
            const NODECLIENT = this.db.node_client;
            if(ctx.session.user && ctx.session.user.id) {
                const userId = ctx.session.user.id;
                let result = await NODEEXCEPTIONPAGE.findAndCountAll({
                    where: {
                        node_id: appid
                    },
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                    include: [
                        {
                            model: NODECLIENT,
                            where: {
                                user_id: userId
                            },
                            attributes: ['name']
                        }
                    ]
                });
                return {status: 'success', nodeException: result};
            }
            return {status: 'failed'};
        })();
    }

    exceptionAnalysis (ctx){
        const params = ctx.request.body;

        return (async ()=>{
            const NODEEXCEPTIONPAGE = this.db.node_exception_page;
            const NODECLIENT = this.db.node_client;
            const Sequelize = this.db.sequelize;

            const nodeId = params.nodeId;
            const dayLimit = params.type != "month";

            let before = parseInt(params.before);
            let after = parseInt(params.after);

            const parseTime = (time)=>{
                return new Date(new Date(time).format("yyyy-MM")+"-01 00:00:00").getTime()
            }

            if(dayLimit){
                before = before? before: new Date(new Date().format("yyyy-MM-dd")+" 00:00:00").getTime();
                after = before + 24 * 60 * 60 * 1000;
            } else {
                before = before? parseTime(before): parseTime();
                let days = new Date(new Date(before).getFullYear(), new Date(before).getMonth()+1, 0).getDate();
                after = before + days * 24 * 60 * 60 * 1000 - 1e3;
            }

            let result = await NODEEXCEPTIONPAGE.findAll({
                where: {
                    node_id: nodeId,
                    client_time: {
                        $between: [new Date(before), new Date(after)]
                    }
                },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                    dayLimit ?
                        [Sequelize.fn('DATE_FORMAT', Sequelize.col('client_time'), "%Y-%m-%d %H"), 'date']
                        :
                        [Sequelize.fn('DATE_FORMAT', Sequelize.col('client_time'), "%Y-%m-%d"), 'date'],
                ],
                group: [
                    `date`
                ]
            });

            let arr = null;

            if(result){
                if(dayLimit){
                    arr = new Array(24);
                    for(let i=0; i<arr.length; i++){
                        arr[i] = {
                            count: 0,
                            time: i
                        }
                    }
                    result.forEach((v)=>{
                        if(v && v.dataValues){
                            let index = parseInt(v.dataValues.date.slice(-2));
                            arr[index].count = v.dataValues.count;
                        }
                    })
                } else {
                    let area = parseInt((after - before + 1e3)/86400000), lastDay = new Date(after);
                    let tmp = {};
                    area > 100? area = 100: null;
                    arr = new Array(area);

                    result.forEach((v)=>{
                        if(v && v.dataValues && v.dataValues.date){
                            tmp[v.dataValues.date] = v.dataValues.count;
                        }
                    })

                    while (area > 0){
                        let dayIndex = lastDay.format("yyyy-MM-dd")

                        arr[--area] = {
                            time: dayIndex,
                            count: tmp[dayIndex]? tmp[dayIndex]: 0
                        }

                        lastDay = new Date(lastDay - 24 * 60 * 60 * 1000);
                    }
                }
            }

            return {status: 'success', result: {
                dateType: dayLimit? 'day': 'month',
                dataArr: arr
            }}

        })();
    }

}

module.exports = NodeService;