/**
 * Created by lenovo on 2017/6/14.
 */

module.exports = class ServiceEngine {
    constructor () {
    }

    load(){
        //此处预留作为RPC方案引擎初始化
        require("../service/commonService");
    }

    handle (index){
        const Service = require(`../service/${index}Service`);
        return new Service();
    }
}