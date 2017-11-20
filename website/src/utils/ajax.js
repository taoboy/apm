/**
 * Created by yangjd on 2017/3/26.
 */

/**
 * 请求数据序列化
 * @param {data} data 数据实体
 */
const serialize = function(data, prefix) {
    if (data && typeof data === 'object' && !(data instanceof FormData)) {
        let paramsArr = [];
        Object.keys(data).map(function(key, i) {
            const head =  prefix? prefix + '[' + key + ']': key;
            let val = data[key];
            if(typeof val == "object"){
                if(val instanceof Date || val instanceof String || val instanceof Number) {
                    paramsArr.push(head + '=' + encodeURIComponent(val.toString()));
                } else {
                    val = serialize(val, head)
                    paramsArr.push(val);
                }
            } else if(typeof val == "number" || typeof val == "boolean") {
                paramsArr.push(head + '=' + val);
            } else {
                val = val? encodeURIComponent(val.toString()): "";
                val = encodeURIComponent(head) + '=' + val
                paramsArr.push(val)
            }
        });
        data = paramsArr.join('&');
    }
    return data;
};


/**
 * 网络请求执行函数，支持GET和POST
 * @param {object} option 请求选项
 *
 * {string}   url      请求URL
 * {string}   type     请求方式(默认为GET)
 * {object}   data     请求数据
 * {string}   dataType 响应数据格式(默认为JSON)
 * {function} success  请求成功回调
 * {function} error    请求失败回调
 */
export default function(option) {
    let url       = option.url || '',
        type      = option.type || 'POST',
        data      = option.data,
        dataType  = option.dataType || 'JSON',
        success   = option.success || function(data) {
            console.log(data);
        },
        error     = option.error || function(err) {
            console.log(err);
        },
        setHeader = false,
        xhr;

    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // GET请求
    if (type.toUpperCase() === 'GET') {
        // 带参
        if (data) {
            data = serialize(data);
        }
        // 不带参
        else {
            data = (new Date()).getTime();
        }

        url += ((url.indexOf('?') >= 0 ? '&_=' : '?_=') + data);
    }
    // POST请求
    else if (type.toUpperCase() === 'POST') {
        //if (data instanceof FormData === false) {
        //    setHeader = true;
        //}
        setHeader = true;
        data = serialize(data);
    }

    xhr.open(type, url, true);
    if (setHeader) {
        xhr.setRequestHeader(
            'Content-type', 'application/x-www-form-urlencoded; charset=utf-8'
        );
    }

    // 状态监听
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (dataType.toUpperCase() === 'JSON') {
                    success(JSON.parse(xhr.responseText));
                } else {
                    success(xhr.responseText);
                }
            } else {
                error(xhr.responseText);
            }
        }
    };
    xhr.send(data);

    return xhr;
}
