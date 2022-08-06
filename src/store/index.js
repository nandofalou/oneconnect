import { createStore } from 'vuex'
import settings from './data/settings'
import sync from './data/sync'

let message
export default createStore({
  state: {
    settings, sync, message
  },
  getters: {
    
  },
  mutations: {
    loadSettings(state) {
      state.settings.load()
    },
    saveSetting(state, data) {
      state.settings.saveRemote(data.url, data.port, data.eventId, data.eventHash, data.clientHash)
      // state.settings.saveSync(data.cadastro_sync, data.leitura_sync, data.imagem_sync)
    },

    toSync(state, result) {
      state.sync.process(result.method, result.data)
    },
    websocketstart(state, params) {
      state.sync.websocketstart(params)
    },
    wssetup(state, params) {
      state.sync.wssetup(params)
    },
    wslogin(state, params) {
      state.sync.wslogin(params)
    },
    wsdata(state, params) {
      state.sync.wsdata(params)
    },
    getall(state, params) {
      state.sync.getall(params)
    },
    countTicket(state, params) {
      state.sync.countTicket(params)
    },
    ws(state, result) {
      state.message =  result
      console.log('recebido ws:', result)
    }

  },
  actions: {
  },
  modules: {
  }
})
