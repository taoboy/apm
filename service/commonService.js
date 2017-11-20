/**
 * Created by lenovo on 2017/7/27.
 */
const Sequelize = require('sequelize');
//const cls = require('continuation-local-storage');
//const namespace = cls.createNamespace('my-very-own-namespace');
const config = require("../config");
const fs = require("fs");
const path = require("path");

const db = (()=> {
    console.log("初始化mysql数据库...[开始]");
    //Sequelize.useCLS(namespace);
    const dbs = [];
    const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
        host: config.mysql.host,
        port: config.mysql.port || 3306,
        dialect: 'mysql',
        timezone: "+08:00",
        logging: process.env.NODE_ENV == "production"? ()=>{}: console.log,
        pool: {
            max: 5,
            min: 0,
            idle: 30000
        },
        define: {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            'underscored': true
        }
    });

    const basename = path.basename(module.filename);
    const modelPath = path.resolve(__dirname, "..", "model", "sequelize");

    fs.readdirSync(modelPath)
    .filter((file)=>{
        return (file.indexOf(".") !== 0) && (file !== basename)
    })
    .forEach((file)=>{
        try {
            let model = sequelize.import(path.join(modelPath, file));
            model.dialect = "mysql";
            dbs[model.name] = model;
        } catch (e) {
            console.error(e);
        }
    });

    Object.keys(dbs).forEach((modelName)=>{
        let model = dbs[modelName];
        if(model.associate && typeof model.associate == "function"){
            model.associate(dbs);
        }
    });

    sequelize.sync({force: false}).then((msg) => {
        console.log("初始化mysql数据库...[OK]");
        console.log("------------------------------------------------");
    }).catch(error => {
        console.error(error);
        console.log("初始化mysql数据库...[FAILED]");
        console.log("------------------------------------------------");
    });

    dbs['sequelize'] = sequelize;

    return dbs;
})();


class CommonService {
    constructor(){
        this.db = db;
    }

    //uuid(){
    //    return uuid.v1();
    //}
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


module.exports = CommonService;