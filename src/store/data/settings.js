import storage from '../storage'
// const { ipcRenderer } = window.require('electron')
// ******************  settings ************************

let settings = {
  url: 'api.ws.cloudid.com.br',
  port: 9000,
  eventId: 1,
  eventHash: null,
  clientHash: null, // x-client
  cadastro_sync: 10000,
  leitura_sync: 10000,
  imagem_sync: 10000,
  sync_id: 1,
  sync_register_id: 1,
  sync_foto_id: 1,
  load: () => {
    const obj = storage.load('settings')
    
    if (obj != null) {
      settings.removeStash()
      settings.url = obj.url
      settings.port = obj.port
      settings.eventId = obj.eventId??null
      settings.eventHash = obj.eventHash??null
      settings.clientHash = obj.clientHash??null
      settings.cadastro_sync = obj.cadastro_sync??null
      settings.leitura_sync = obj.leitura_sync??null
      settings.imagem_sync = obj.imagem_sync??null
      settings.sync_id = obj.sync_id??0
      settings.sync_register_id = obj.sync_register_id??0
      settings.sync_foto_id = obj.sync_foto_id??0
    }
  },
  autoSave: () => {
    settings.removeStash()
    storage.save('settings',
      {
        url: settings.url,
        port: settings.port,
        eventId: settings.eventId,
        eventHash: settings.eventHash,
        clientHash: settings.clientHash,
        cadastro_sync: settings.cadastro_sync,
        leitura_sync: settings.leitura_sync,
        imagem_sync: settings.imagem_sync,
        sync_id: settings.sync_id,
        sync_register_id: settings.sync_register_id,
        sync_foto_id: settings.sync_foto_id,
      }
    )
  },
  saveAll: (data) => {
    settings.url = data.url
    settings.port = data.port
    settings.removeStash()
    settings.eventId = data.eventId??null
    settings.eventHash = data.eventHash??null
    settings.clientHash = data.clientHash??null
    storage.save('settings',
      {
        url: settings.url,
        port: settings.port,
        eventId: settings.eventId,
        eventHash: settings.eventHash,
        clientHash: settings.clientHash,
        cadastro_sync: settings.cadastro_sync,
        leitura_sync: settings.leitura_sync,
        imagem_sync: settings.imagem_sync,
        sync_id: settings.sync_id,
        sync_register_id: settings.sync_register_id,
        sync_foto_id: settings.sync_foto_id,
      }
    )
  },
  saveRemote: (url, port, eventId, eventHash, clientHash) => {
    settings.url = url
    settings.port = port
    settings.eventId = eventId
    settings.eventHash = eventHash
    settings.clientHash = clientHash
    settings.removeStash()
    settings.autoSave()
  },
  saveSync: (cadastro_sync, leitura_sync, imagem_sync) => {
    settings.cadastro_sync = cadastro_sync
    settings.leitura_sync = leitura_sync
    settings.imagem_sync = imagem_sync
    settings.autoSave()
  },
  saveSyncId: (sync_id) => {
    settings.sync_id = sync_id
    settings.autoSave()
  },
  saveSyncRegisterId: (sync_id) => {
    settings.sync_register_id = sync_id
    settings.autoSave()
  },
  saveSyncFotoId: (sync_id) => {
    settings.sync_foto_id = sync_id
    settings.autoSave()
  },
  geteventHash: () => {
    return settings.eventHash
  },
  geteventEventId: () => {
    return settings.eventId
  },
  getSyncId: () => {
    return settings.sync_id
  },
  getSyncRegisterId: () => {
    return settings.sync_register_id
  },
  getSyncFotoId: () => {
    return settings.sync_foto_id
  },
  getRemote: () => {
    return {
      url: settings.url,
      port: settings.port,
      eventId: settings.eventId,
      eventHash: settings.eventHash,
      clientHash: settings.clientHash
    }
  },
  getSync: () => {
    return {
      cadastro_sync: settings.cadastro_sync,
      leitura_sync: settings.leitura_sync,
      imagem_sync: settings.imagem_sync
    }
  },
  removeStash: () => {
    const slash = settings.url.slice(-1)
    if (slash === '/') {
      settings.url = settings.url.slice(0, -1)
    }
  }
}

// ******************  settings ************************
export default settings
