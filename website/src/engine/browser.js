/**
 * Created by lenovo on 2017/7/28.
 */
import Common from './common'

class Browserdash extends Common {
    constructor(){
        super();
    }

    renderSuccess (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=performance", params, callback);
    };

    broException(params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=exception", params, callback);
    };

    broExceptionDetail(params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=exceptionDetail", params, callback);
    };

    broBusiness(params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=business", params, callback);
    };

    broEntries(params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=entries", params, callback);
    };

    browserClient(params,callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=webClient", params, callback);
    };

    browserHref(params,callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=distinctHref", params, callback);
    };

    analysisPV(params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=analysisPerformancePV", params, callback);
    }

    analysisPF(params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=analysisPerformancePF", params, callback);
    }

    analysisPFdetail(params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=analysisPFdetail", params, callback);
    }
}


export default new Browserdash();