import Vue from "vue"
import Router from "vue-router"

import Bracket from "./views/Bracket.view.vue"
import ParticipantForm from "./views/ParticipantForm.view.vue"

Vue.use(Router)

export default new Router({
  routes: [
    { path: "/", component: ParticipantForm },
    { path: "/bracket/:id", component: Bracket },
  ],
})
