<template>
  <div id="app">
    <nav class="navbar  navbar-dark bg-dark">
      <div class="container">
        <button
          class="navbar-toggler p-0 border-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand" href="">OneConnect</a>
      </div>
    </nav>

    
  </div>
  <router-view />
</template>
<script>
const { ipcRenderer } = window.require('electron')

export default {
  name: "App",

  data: () => ({
    //
  }),
  mounted () {
    ipcRenderer.on('EVENT', (event, resp) => {
      this.$store.commit('ws', resp)
    })
    ipcRenderer.on('TICKET', (event, resp) => {
      this.$store.commit('ws', resp)
    })
    ipcRenderer.on('STATUS', (event, resp) => {
      this.$store.commit('ws', resp)
    })
    ipcRenderer.on('CATEGORY', (event, resp) => {
      this.$store.commit('ws', resp)
    })
    ipcRenderer.on('FIELD', (event, resp) => {
      this.$store.commit('ws', resp)
    })
    ipcRenderer.on('TICKET', (event, resp) => {
      this.$store.commit('ws', resp)
    })
    ipcRenderer.on('WS.STATUS', (event, resp) => {
      console.log('WS.STATUS', resp)
    })
    ipcRenderer.on('WS.LOGIN', (event, resp) => {
      console.log('WS.LOGIN', resp)
    })
    ipcRenderer.on('WS.DATA', (event, resp) => {
      console.log('WS.DATA', resp)
    })
  }
};
</script>
<style>
</style>
