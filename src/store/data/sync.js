
const { ipcRenderer } = window.require('electron')
const sync  = {
    process:(method, data) =>{
        if(method === 'API.GETEVENT') {
            sync.getEvent(data)
        }
        if(method === 'API.GETCATEGORY') {
            sync.getCategory(data)
        }
        if(method === 'API.GETFIELD') {
            sync.getField(data)
        }
        if(method === 'API.GETSTATUS') {
            sync.getStatus(data)
        }
        if(method === 'API.GETTICKET') {
            sync.getTicket(data)
        }
    },
    getEvent:(data) => {
        return ipcRenderer.send('GETEVENT', data)
    },
    getCategory:(data) => {
        return ipcRenderer.send('GETCATEGORY', data)
    },
    getField:(data) => {
        return ipcRenderer.send('GETFIELD', data)
    },
    getStatus:(data) => {
        return ipcRenderer.send('GETSTATUS', data)
    },
    getTicket:(data) => {
        ipcRenderer.send('GETTICKET', data)
        
    },
    wssetup:(params) => {
        ipcRenderer.send('WSSETUP', params)
    },
    wslogin:(params) => {
        ipcRenderer.send('WSLOGIN', params)
    },
    wsdata:(params) => {
        ipcRenderer.send('WSDATA', params)
    },
    getall:(params) => {
        ipcRenderer.send('GETALL', params)
    },
    countTicket:(params) => {
        ipcRenderer.send('COUNTTICKET', params)
    },
    websocketstart:(params) => {
        ipcRenderer.send('WSSTART', params)
    }
}

// ******************  sync ************************
export default sync
