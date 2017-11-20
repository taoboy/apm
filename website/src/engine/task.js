/**
 * Created by lenovo on 2017/8/25.
 */
import Common from './common'

class Task extends Common{
    constructor(){
        super();
    }

    myNodeTask (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/node.action?fn=nodeClient", params, callback);
    };

    addNodeTask (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/node.action?fn=addNodeClient", params, callback);
    }

    myWebTask (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=webClient", params, callback);
    };

    addWebTask (params, callback){
        this.handle("/api/frontEnd/yyfaxapm/web.action?fn=addWebClient", params, callback);
    }

}


export default new Task();