/**
 * Created by lenovo on 2017/8/16.
 */
import Common from './common'

class Nodedash extends Common{
    constructor(){
        super();
    }

    getUserNode (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/node.action?fn=nodeClient", params, callback);
    }

    nodeError (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/node.action?fn=error", params, callback);
    };

    nodeException (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/node.action?fn=exception", params, callback);
    };

    errorAnalysis (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/node.action?fn=errorAnalysis", params, callback);
    }

    exceptionAnalysis (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/node.action?fn=exceptionAnalysis", params, callback);
    }
}


export default new Nodedash();