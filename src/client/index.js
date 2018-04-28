import Vue from "vue"
import VueSocket from "vue-socket.io"
import VModal from "vue-js-modal"
import "vue-awesome/icons"
import Icon from "vue-awesome/components/Icon"
import VueClipboard from "vue-clipboard2"
import * as OfflinePluginRuntime from "offline-plugin/runtime"
import VTooltip from "v-tooltip"

import App from "./App.vue"
import router from "./router"
import store, { mutationTypes } from "./store"

Vue.config.productionTip = false

Vue.component("icon", Icon)

const wsHost =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : `${location.origin.replace(/^http/, "ws")}`

Vue.use(VueSocket, wsHost, store)
Vue.use(VModal)
Vue.use(VTooltip)
Vue.use(VueClipboard)

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
