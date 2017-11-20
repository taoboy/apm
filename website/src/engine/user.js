/**
 * Created by lenovo on 2017/7/28.
 */
import Ajax from '../utils/ajax'
import Common from './common'
import {setCookie, getCookie, delCookie} from '../utils/cookie'

class User extends Common{
    constructor(){
        super();
    }

    checkLogin (callback){
        const userId = getCookie('userId');
        //if(userId){
        if(false){
            callback(null, {
                status: "success",
                user: {
                    id: userId
                }
            });
        } else {
            Ajax({
                url: "/api/frontEnd/yyfaxapm/user.action?fn=checkLogin",
                success: (data)=>{
                    if(data.status == "success" && data.user && data.user.id){
                        const userId = data.user.id;
                        //setCookie("userId", userId);
                    }
                    callback(null, data);
                },
                error: (err)=>{
                    callback(err);
                }
            });
        }
    }

    login (params, callback){

        let paramArr = `username=${params.username}&password=${params.password}`;

        let myHeaders = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'X-Custom-Header': 'ProcessThisImmediately'
        });
        //myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        //myHeaders.append('X-Custom-Header', 'ProcessThisImmediately');

        fetch("/api/frontEnd/yyfaxapm/user.action?fn=login", {
            method: "post",
            headers: myHeaders,
            body: paramArr,
            credentials: "include"
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            if(data.status == "success" && data.user && data.user.id){
                const userId = data.user.id;
                setCookie("userId", userId);
            }
            callback(null, data);
        }).catch((error)=>{
        });


        //Ajax({
        //    url: "/api/frontEnd/yyfaxapm/user.action?fn=login",
        //    data: params,
        //    success: (data)=>{
        //        if(data.status == "success" && data.user && data.user.id){
        //            const userId = data.user.id;
        //            setCookie("userId", userId);
        //        }
        //        callback(null, data);
        //    },
        //    error: (err)=>{
        //        callback(err);
        //    }
        //});
    }

    logout (params, callback){
        Ajax({
            url: "/api/frontEnd/yyfaxapm/user.action?fn=logout",
            data: params,
            success: (data)=>{
                if(data.status == "success"){
                    delCookie("userId");
                }
                callback(null, data);
            },
            error: (err)=>{
                callback(err);
            }
        });
    }

    getNotify(callback){
        this.handle("/api/frontEnd/yyfaxapm/user.action?fn=getNotify", null, callback)
    }
}


export default new User();