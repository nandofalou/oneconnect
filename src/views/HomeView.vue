<template>
  <div class="home">
    <DrawerConfig msg="Welcome to Your Vue.js App" />
    <button @click.stop.prevent="start()">start</button>
    <button @click.stop.prevent="eventStart()">loadEventData</button>
    <button @click.stop.prevent="startws()">start ws back</button>
    <button @click.stop.prevent="loginws()">login ws back</button>
    <button @click.stop.prevent="dataws()">data ws back</button>
    <button @click.stop.prevent="getall()">getall ws back</button>
    <button @click.stop.prevent="countTicket()">countTicket ws back</button>
    <div>{{sync.status}}</div>
    <div>{{message}}</div>
  </div>
</template>

<script>
// @ is an alias to /src
import DrawerConfig from "@/components/DrawerConfig.vue";
import ws from "../lib/ws";

export default {
  name: "HomeView",
  components: {
    DrawerConfig,
  },
  methods: {
    start() {
      let params = {
        event_id: 1,
        event_hash: "C47124",
        client_hash: "a941a999217ef99500aa0d57b2861c40",
      };
      this.clienteWs.sendData("AUTH.LOGIN", params, function (data) {
        console.log("return data", data);
      });
    },

    startws() {
      let params = {
        url: this.settings.url,
        port: this.settings.port,
        ssl: false,
        event_id: this.settings.eventId,
        event_hash: this.settings.eventHash,
        client_hash: this.settings.clientHash
      };
      this.$store.commit("wssetup", params)
    },
    loginws() {
      let data = {
      method: "AUTH.LOGIN",
        params: {
          event_id: this.settings.eventId,
          event_hash: this.settings.eventHash,
          client_hash: this.settings.clientHash
        }
      }
      this.$store.commit("wslogin", data)
    },
    dataws() {
      let data = {
      method: "AUTH.LOGIN",
        params: {
          event_id: this.settings.eventId,
          event_hash: this.settings.eventHash,
          client_hash: this.settings.clientHash
        }
      }
      this.$store.commit("wsdata", data)
    },
    getall() {
      let params = { sync: 1 };
      let data = {
      method: "API.GETALL",
        params
      }
      this.$store.commit("getall", data)
    },
    countTicket() {
      let params = { sync: 1 };
      let data = {
      method: "TICKET.COUNT",
        params
      }
      this.$store.commit("countTicket", data)
    },
    eventStart() {
      let params = { sync: 1 };
      const store = this.$store;
      this.clienteWs.sendData("API.GETALL", params, function (data) {
        if (data.status) {
          store.commit("toSync", {
            method: "API.GETEVENT",
            data: {
              sync: data.sync.lastSync,
              event: data.sync.event,
            },
          });
          store.commit("toSync", {
            method: "API.GETCATEGORY",
            data: {
              sync: data.sync.lastSync,
              category: data.sync.category,
            },
          });
          store.commit("toSync", {
            method: "API.GETFIELD",
            data: {
              sync: data.sync.lastSync,
              field: data.sync.field,
            },
          });
          store.commit("toSync", {
            method: "API.GETSTATUS",
            data: {
              sync: data.sync.lastSync,
              status: data.sync.status,
            },
          });
          for(let t=0; t<=data.sync.ticket.length -1 ; t++ ) {
            store.commit("toSync", {
                method: "API.GETTICKET",
                data: {
                  sync: data.sync.lastSync,
                  ticket: data.sync.ticket[t],
                },
              });
          }
          // data.sync.ticket.forEach(element => {
          //   console.log('ticket', element.cod)
          //   store.commit("toSync", {
          //       method: "API.GETTICKET",
          //       data: {
          //         sync: data.sync.lastSync,
          //         ticket: element,
          //       },
          //     });
          // });
          // if(page.totalPage >0) {
          // const news = [];
          // for(let t=0; t<=5; t++) {
          //   news.push(data.sync.ticket[t])
          // }

          // store.commit("toSync", {
          //   method: "API.GETTICKET",
          //   data: {
          //     sync: data.sync.lastSync,
          //     ticket: news,
          //   },
          // });
          // store.commit("toSync", {
          //   method: "API.GETTICKET",
          //   data: {
          //     sync: data.sync.lastSync,
          //     ticket: data.sync.ticket,
          //   },
          // });
        } else {
          console.log(data.message);
        }
      });
    },
  },
  computed: {
    settings: function () {
      return this.$store.state.settings;
    },
    sync: function () {
      return this.$store.state.sync;
    },
    message: function () {
      return this.$store.state.message;
    },
  },
  data() {
    return {
      clienteWs: ws,
    };
  },
  mounted() {
    this.$store.commit("loadSettings");
    this.clienteWs.init(this.settings.url, 9000, false, (data) => {
      console.log("anonimous", data);
    });
  },
};
</script>
