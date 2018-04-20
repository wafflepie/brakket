import Vue from "vue"
import VueSocket from "vue-socket.io"
import * as OfflinePluginRuntime from "offline-plugin/runtime"

import App from "./App.vue"
import router from "./router"
import store, { mutationTypes } from "./store"

Vue.config.productionTip = false

Vue.use(VueSocket, "http://localhost:3001", store)

new Vue({
  beforeCreate() {
    this.$store.commit(mutationTypes.SET_SOCKET, this.$socket)
  },
  render: createElement => createElement(App),
  router,
  store,
}).$mount("#app")

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "production") {
  OfflinePluginRuntime.install()
}
