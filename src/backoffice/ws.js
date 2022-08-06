const WebSocketClient = require('websocket').client
const client = new WebSocketClient({closeTimeout:999999999, maxReceivedMessageSize: 999999999 ,maxReceivedFrameSize: 999999999})

const ws = {
    socket: null,
    ts: null,
    win: null,
    stack: [],
    lastStackId: 0,
    paramsLogin: null,
    callback: null,
    connection: {
        protocol: 'ws',
        host: null,
        port: null,
        status: false,
        event_id: false,
        event_hash: false,
        client_hash: false,
        get: () => {
            const param = ws.connection
            return `${param.protocol}://${param.host}:${param.port}`
        }
    },
    init: (data, callback) => {
        console.log('receiver_data', data)
        ws.connection.protocol = data.ssl ? 'wss' : 'ws'
        ws.connection.host = data.url
        ws.connection.port = data.port
        ws.connection.event_id = data.event_id
        ws.connection.event_hash = data.event_hash
        ws.connection.client_hash = data.client_hash
        ws.callback = callback
        // ws.connect()
        ws.autoConn()
    },
    connect: () => {
        if(ws.connection.status) {
            ws.win.webContents.send('WS.STATUS', "is already connected ")
            return;
        }
        ws.win.webContents.send('WS.STATUS', "awayt to connect on " + ws.connection.get())
        // clearInterval(ws.ts)
       // ws.socket = null
        
        client.connect(ws.connection.get())
        client.on('connect', function (connection) {
            ws.socket = connection
            ws.connection.status = true;
            ws.win.webContents.send('WS.STATUS', "connected")
            
            connection.on('error', function (error) {
               // ws.socket.close()
               // ws.connection.status = false;
                console.log("Connection error: " + error.toString());
              //  ws.connection.status = false;
                ws.win.webContents.send('WS.STATUS', "Connection error " + error.toString())
            });

            connection.on('close', function () {
                ws.socket.close()
                ws.connection.status = false;
                console.log('Connection closed!');
                ws.win.webContents.send('WS.STATUS', "Connection closed!")
            });

            connection.on('message', function (message) {
                ws.responseData(message.utf8Data)
                ws.win.webContents.send('WS.STATUS', "Received message...")
                // ws.win.webContents.send('WS.DATA', message.utf8Data)
                // console.log("response is: ", message.utf8Data);
            })

            ws.sendLogin = function login() {
                
                const data = { 
                        event_id: ws.connection.event_id,
                        event_hash: ws.connection.event_hash,
                        client_hash: ws.connection.client_hash
                    }
                const params = {
                        method: 'AUTH.LOGIN',
                        params: data,
                        id: ws.getUniqueID()
                    }
                if (connection.connected) {
                    console.log('sendLogin . enviando solicitacoes:', params)
                    connection.send(JSON.stringify(params));
                } else {
                    console.log('não conectado')
                }
            }

          
        });
    },
    sendData: (method, data, callback) => {
        if(!ws.socket) {
            console.log('não conectado')
            return callback;
        }
        data = ws.requestData(method, data)
        ws.stack.push({
            id: data.id,
            callback,
            ts: Date.now()
        });
        console.log('enviando:', data)
        if (ws.connection.status) { 
            ws.socket.send(JSON.stringify(data))
        } else {
            console.log('não conectado')
        }
    },
    responseData: (message) => {
        let data = null;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.log('log', 'invalid data')
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
                    if(ws.connection.host !== null &&   ws.connection.port !== null) {
                        ws.connect()
                    }
                }
            }, 1000
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