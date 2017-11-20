/**
 * Created by lenovo on 2017/9/27.
 */
import Ajax from '../utils/ajax'

class Common {
    constructor(){
        this.handle = (_url, _data, _cb)=>{
            Ajax({
                url: _url,
                data: _data,
                success: (data)=>{
                    _cb(null, data);
                },
                error: (err)=>{
                    _cb(err);
                }
            });
        }
    }
}


export default Common;