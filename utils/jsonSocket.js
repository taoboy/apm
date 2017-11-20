/**
 * Created by lenovo on 2017/7/11.
 */

const {StringDecoder} = require('string_decoder');
const decoder = new StringDecoder();

class JsonSocket {
    constructor(socket, opts){
        this._socket = socket;
        this._contentLength = null;
        this._buffer = '';
        this._opts = opts || {}
        if (!this._opts.delimeter) {
            this._opts.delimeter = '#';
        }
        this._closed = true;
        this.init();
    }

    init (){
        this._socket.on('data', this._onData.bind(this));
        this._socket.on('connect', this._onConnect.bind(this));
        this._socket.on('close', this._onClose.bind(this));
        this._socket.on('error', this._onError.bind(this));
    }

    _onData (data) {
        data = decoder.write(data);
        try {
            this._handleData(data);
        } catch (e) {
            this.sendError(e);
        }
    }

    _handleData (data) {
        this._buffer += data;
        if (this._contentLength == null) {
            const i = this._buffer.indexOf(this._opts.delimeter);
            //Check if the buffer has a this._opts.delimeter or "#", if not, the end of the buffer string might be in the middle of a content length string
            if (i !== -1) {
                const rawContentLength = this._buffer.substring(0, i);
                this._contentLength = parseInt(rawContentLength);
                if (isNaN(this._contentLength)) {
                    this._contentLength = null;
                    this._buffer = '';
                    const err = new Error('Invalid content length supplied ('+rawContentLength+') in: '+this._buffer);
                    err.code = 'E_INVALID_CONTENT_LENGTH';
                    throw err;
                }
                this._buffer = this._buffer.substring(i+1);
            }
        }
        if (this._contentLength != null) {
            const length = Buffer.byteLength(this._buffer, 'utf8');
            if (length == this._contentLength) {
                this._handleMessage(this._buffer);
            } else if (length > this._contentLength) {
                const message = this._buffer.substring(0, this._contentLength);
                const rest = this._buffer.substring(this._contentLength);
                this._handleMessage(message);
                this._onData(rest);
            }
        }
    }

    _handleMessage (data) {
        this._contentLength = null;
        this._buffer = '';
        let message;
        try {
            message = JSON.parse(data);
        } catch (e) {
            const err = new Error('Could not parse JSON: '+e.message+'\nRequest data: '+data);
            err.code = 'E_INVALID_JSON';
            throw err;
        }
        message = message || {};
        this._socket.emit('message', message);
    }

    sendError (err) {
        this.sendMessage(this._formatError(err));
    }

    sendEndError (err) {
        this.sendEndMessage(this._formatError(err));
    }

    _formatError (err) {
        return {success: false, error: err.toString()};
    }

    sendMessage (message, callback) {
        if (this._closed) {
            if (callback) {
                callback(new Error('The socket is closed.'), null);
            }
            return;
        }
        this._socket.write(this._formatMessageData(message), 'utf-8', callback? callback(null, {status: "success"}): void(0));
    }

    sendEndMessage (message, callback) {
        this.sendMessage(message, err => {
            this.end();
            if (callback) {
                if (err) return callback(err, null);
                callback(null, {status: "success"});
            }
        });
    }

    _formatMessageData (message) {
        const messageData = JSON.stringify(message);
        const length = Buffer.byteLength(messageData, 'utf8');
        const data = length + this._opts.delimeter + messageData;
        return data;
    }

    _onClose () {
        this._closed = true;
    }

    _onConnect () {
        this._closed = false;
    }

    _onError (err) {
        this._closed = true;
    }

    isClosed () {
        return this._closed;
    }

};

const delegates = [
    'connect',
    'on',
    'end',
    'setTimeout',
    'setKeepAlive',
    'destroy'
];
delegates.forEach(function(method) {
    JsonSocket.prototype[method] = function() {
        this._socket[method].apply(this._socket, arguments);
        return this
    }
});

module.exports = JsonSocket;