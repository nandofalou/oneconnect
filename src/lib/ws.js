const ws = {
    socket: null,
    ts: null,
    stack: [],
    lastStackId: 0,
    callback: null,
    connection: {
        protocol: 'ws',
        host: null,
        port: null,
        status: false,
        get: () => {
            const param = ws.connection
            return `${param.protocol}://${param.host}:${param.port}`
        }
    },
    init: (host, port, ssl, callback) => {
        ws.connection.protocol = ssl ? 'wss' : 'ws'
        ws.connection.host = host
        ws.connection.port = port
        ws.connect()
        ws.autoConn()
        ws.callback = callback
    },
    connect: () => {
        ws.socket = null
        ws.socket = new WebSocket(ws.connection.get())
        ws.socketListener()
    },
    socketListener: () => {
        // Connection opened
        ws.socket.addEventListener('open', function () {
            ws.connection.status = true;
            console.log('Connected to WS Server')
        });

        // Listen for messages
        ws.socket.addEventListener('message', function (event) {
            ws.responseData(event.data)
        });

        // Listen for errors
        ws.socket.addEventListener('error', function () {
            ws.connection.status = false;
        });

        // Listen for close
        ws.socket.addEventListener('close', function () {
            ws.connection.status = false;
        })
    },
    sendData: (method, data, callback) => {
        data = ws.requestData(method, data)
        ws.stack.push({
            id: data.id,
            callback,
            ts: Date.now()
        });
        ws.socket.send(JSON.stringify(data))
    },
    responseData: (message) => {
        let data = null;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console('log', 'invalid data')
        }

        if (data) {
            let ret = {
                result: data.result ? data.result : null,
                id: data.id ? data.id : null,
                error: data.error ? data.error : null
            }

            if (ret.id) {
                ws.callbackResponseData(ret)
            } else {
                ws.anyCallbackResponseData(ret)
            }
        }
    },
    callbackResponseData: (data) => {
        const index = ws.stack.findIndex(aa => aa.id === data.id)
        if (index !== -1) {
            ws.stack[index].callback(data.result)
            ws.stack.splice(index, 1)
        }
    },
    anyCallbackResponseData: (data) => {
        ws.callback(data)
    },
    autoConn: () => {
        ws.ts = setInterval(
            function () {
                if (!ws.connection.status) {
                    ws.connect()
                }
            }, 5000
        )
    },
    requestData: (method = null, params = null) => {
        return {
            method,
            params,
            id: ws.getUniqueID()
        }
    },
    getUniqueID: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        }
        return ++ws.lastStackId + s4() + '-' + ws.lastStackId + '-' + s4()
    }

}

export default ws