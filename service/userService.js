/**
 * Created by lenovo on 2017/7/27.
 */
const CommonService = require("./commonService");

class UserService extends CommonService {
    constructor(){
        super();
    }


    checkLogin (ctx){
        return (async ()=>{
            if(ctx.session && ctx.session.user) {
                return {status: "success", user: ctx.session.user}
            }
            return {status: "failed"}
        })()
    }

    regist (ctx){
        return (async ()=>{
            const USER = this.db.user;
            let formData = ctx.request.body;
            let username = formData.username;

            let user = await USER.findOne({where: {username: username}});
            if(user){
                return {status: 'failed', code: 10000, msg: "user exist"}
            }

            user = await USER.create(formData);
            return {status: "success", user: user}
        })();
    }

    login (ctx){
        return (async ()=>{
            const USER = this.db.user;
            let formData = ctx.request.body;
            let username = formData.username;
            let password = formData.password;

            let user;
            user = await USER.findOne({where: {username: username}});
            if(user){
                if(user.password == password){
                    ctx.session.user = user;
                    return {status: 'success', user: user}
                } else {
                    return {status: 'failed', code: 10000, msg: "password error"}
                }
            } else {
                return {status: 'failed', code: 10000, msg: "user not exist"}
            }
        })();
    }

    logout (ctx){
        return (async ()=> {
            if (ctx.session.user) {
                delete ctx.session.user;
            }
            return {status: "success"}
        })();
    }

    getNotify (ctx){
        return (async ()=> {
            const NODEERROR = this.db.node_error_page;
            const NODEEXCEPTION = this.db.node_exception_page;
            const WENEXCEPTIONPAGE = this.db.web_exception_page;

            const NODECLIENT = this.db.node_client;
            const WEBCLIENT = this.db.web_client;

            if(!ctx.session.user)return {status: 'failed'};

            const userId = ctx.session.user.id;
            let success = {
                status: 'success',
                result: {
                    node: 0,
                    web: 0
                }
            }, failed = {
                status: 'failed'
            };

            //let nodeClients = await NODECLIENT.findAll({
            //    where: {
            //        user_id: userId
            //    }
            //});

            let before = new Date(new Date().format("yyyy-MM-dd")+" 00:00:00").getTime();
            let after = before + 24 * 60 * 60 * 1000;
            let nodeErrorCount = await NODEERROR.count({
                include: [
                    {
                        model: NODECLIENT,
                        where: {
                            user_id: userId
                        }
                    }
                ],
                where: {
                    //node_id: {
                    //    $in: nodeClients
                    //},
                    client_time: {
                        $between: [new Date(before), new Date(after)]
                    }
                }
            });

            let nodeExceptionCount = await NODEEXCEPTION.count({
                include: [
                    {
                        model: NODECLIENT,
                        where: {
                            user_id: userId
                        }
                    }
                ],
                where: {
                    //node_id: {
                    //    $in: nodeClients
                    //},
                    client_time: {
                        $between: [new Date(before), new Date(after)]
                    }
                }
            });

            success.result.node = nodeErrorCount + nodeExceptionCount;

            //let webClients = await WEBCLIENT.findAll({
            //    where: {
            //        user_id: userId
            //    }
            //});

            let webExceptionCount = await WENEXCEPTIONPAGE.count({
                include: [
                    {
                        model: WEBCLIENT,
                        where: {
                            user_id: userId
                        }
                    }
                ],
                where: {
                    //node_id: {
                    //    $in: nodeClients
                    //},
                    client_time: {
                        $between: [new Date(before), new Date(after)]
                    }
                }
            });

            success.result.web = webExceptionCount;

            return success;
        })();
    }
}

module.exports = UserService;