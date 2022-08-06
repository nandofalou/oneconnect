import settings from './data/settings'

export default {
    state: () => ({ settings }),
    mutations: {
        loadSettings(state) {
            state.settings.load()
        },
        saveSettings(state, data) {
            state.settings.saveAll(data)
        },
        save(state) {
            state.settings.autoSave()
        }
    },
    actions: {

    }
}