import Vue from "vue"
import Router from "vue-router"

import Brackets from "./views/Brackets.view.vue"
import Home from "./views/Home.view.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/brackets",
      name: "brackets",
      component: Brackets,
    },
  ],
})
