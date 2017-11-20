/**
 * Created by lenovo on 2017/6/13.
 */
const CommonMiddleware = require("./commonMiddleware");
const session = require("koa-session2");
const Redis = require("ioredis");

function sessionWrapper(opts = {}) {
    const {key = "koa:sess", store = new session.Store()} = opts;

    return async(ctx, next) => {
        let id = ctx.cookies.get(key, opts);

        if (!id) {
            ctx.session = {};
        } else {
            ctx.session = await store.get(id);
            // check session must be a no-null object
            if (typeof ctx.session !== "object" || ctx.session == null) {
                ctx.session = {};
            }
        }

        const old = JSON.stringify(ctx.session);

        await next();

        // if not changed
        if (old == JSON.stringify(ctx.session)) return;

        // if is an empty object
        if (typeof ctx.session === 'object' && !Object.keys(ctx.session).length) {
            ctx.session = null;
        }

        // need clear old session
        if (id && !ctx.session) {
            await store.destroy(id);
            return;
        }

        // set/update session
        let expires;
        if (ctx.session.userInfo && ctx.session.userInfo.expires) {
            expires = parseInt((ctx.session.userInfo.expires - Date.now() - 1000)/1000);
        }
        const sid = await store.set(ctx.session, Object.assign({}, opts, {sid: id, maxAge: expires}));
        ctx.cookies.set(key, sid, opts);
    }
}

class RedisStore extends session.Store {
    constructor(options) {
        super();
        this.folder = options.folder;
        delete options.folder;
        this.redis = new Redis(options);
    }

    async get(sid) {
        let data = await this.redis.get(`${this.folder}:${sid}`);
        return JSON.parse(data);
    }

    // 24 hour expires
    async set(session, {sid = this.getID(24), maxAge = 3600 * 24} = {}) {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`${this.folder}:${sid}`, JSON.stringify(session), 'EX', maxAge);
        } catch (e) {
        }
        return sid;
    }

    async destroy(sid) {
        return await this.redis.del(`${this.folder}:${sid}`);
    }
}

module.exports = class SessionMiddleware extends CommonMiddleware {

    constructor() {
        super();
    }

    load(app) {
        app.use(sessionWrapper({
            key: SESSION.SESSION_NAME,
            store: new RedisStore(Object.assign({}, CONFIG.redis, {
                folder: SESSION.SESSION_NAME
            }))
        }));
        console.log("中间件:session...[OK]");
    }
}
