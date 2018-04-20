import Vue from "vue"
import * as OfflinePluginRuntime from "offline-plugin/runtime"

import App from "./App.vue"
import router from "./router"
import store from "./store"

Vue.config.productionTip = false

new Vue({
  render: createElement => createElement(App),
  router,
  store,
}).$mount("#app")

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "production") {
  OfflinePluginRuntime.install()
}
