import Vue from "vue"
import Router from "vue-router"

import Brackets from "./views/Brackets.view.vue"
import ParticipantForm from "./views/ParticipantForm.view.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "participantForm",
      component: ParticipantForm,
    },
    {
      path: "/brackets",
      name: "brackets",
      component: Brackets,
    },
  ],
})
