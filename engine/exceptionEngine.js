/**
 * Created by lenovo on 2017/6/14.
 */

module.exports = class ExceptionEngine {
    constructor () {
    }

    load(){
        //封装Promise回调异常捕获方法，用于上报监控
        let originCatch = Promise.prototype.catch;
        Promise.prototype.catch = function (onRejected) {
            return originCatch.call(this, function (error) {

                //console.error("----------------Promise err----------------");
                //console.error(error);

                //report error to monitor

                if(onRejected)return onRejected(error);
                return false;
            });
        };

        //异步回调错误致死
        process.on('uncaughtException', function (err) {
            console.error("----------------uncaughtException----------------");
            console.error(err);
            // report error to monitor
        });

        //同步回调错误不致死
        process.on('unhandledRejection', function (err, p) {
            console.error("----------------unhandledRejection----------------");
            console.error(err);
            // report error to monitor
        });
    }

}