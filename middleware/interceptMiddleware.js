/**
 * Created by lenovo on 2017/6/13.
 */
const { SESSION_NAME, SESSION_P2P, SESSION_P2P_SIG, SESSION_TOKEN } = global.SESSION;
const CommonMiddleware = require("./commonMiddleware");

const UserService = require("../service/userService");
const userService = new UserService();


module.exports = class InterceptMiddleware extends CommonMiddleware {

    constructor (){
        super();
    }

    load (app){
        app.use(async(ctx, next) => {

            //在用户状态即将到期时，暂定5s
            //向user同步用户状态，session续期
            if(
                ctx.session &&
                ctx.session.userInfo &&
                ctx.session.token &&
                ctx.session.userInfo.expires<(Date.now()+5000)
            ){
                let res = await userService.getSessInfo(ctx);
                if (res.code === 0) {
                    ctx.session.userInfo = res.content;
                    ctx.session.token = res.content.token;
                    ctx.cookies.set(SESSION_TOKEN, res.content.token);
                }
            }
            return next();
        });
    }

};