<template>
  <div
    class="offcanvas offcanvas-start"
    tabindex="-1"
    id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasExampleLabel">Configurações</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <div class="form-floating mb-3">
        <input
          type="url"
          v-model="settings.url" 
          class="form-control"
          id="url"
          placeholder="api.ws.cloudid.com.br"
        />
        <label for="floatingInput">Endereço da api</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="number"
          v-model="settings.port" 
          class="form-control"
          id="port"
          placeholder="9000"
        />
        <label for="floatingInput">WS PORT (9000)</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="number"
          v-model="settings.eventId"
          class="form-control"
          id="event_id"
          placeholder="100"
        />
        <label for="floatingPassword">ID do Evento</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          v-model="settings.eventHash"
          class="form-control"
          id="event_hash"
          placeholder="xxxx"
        />
        <label for="floatingInput">Hash do Evento</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          v-model="settings.clientHash"
          class="form-control"
          id="client_hash"
          placeholder="xxxx"
        />
        <label for="floatingInput">Hash do Connect</label>
      </div>
      <div class="">
        <button
          type="submit"
          class="btn btn-primary"
          @click.stop.prevent="submit()"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DrawerConfig",
  components: {
  },
  methods: {
    submit() {
      const data = {
        url: this.settings.url,
        port: this.settings.port,
        eventId: this.settings.eventId,
        eventHash: this.settings.eventHash,
        clientHash: this.settings.clientHash,
      }
      this.$store.commit("saveSetting", data);
      this.$store.commit("loadSettings");
    }
  },
  computed: {
    settings: function () {
      return this.$store.state.settings;
    }
  },
  created() {
    this.$store.commit("loadSettings");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
