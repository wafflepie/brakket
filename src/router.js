import Vue from "vue"
import Router from "vue-router"

import BracketView from "./views/BracketView.vue"
import HomeView from "./views/HomeView.vue"
import NotFoundView from "./views/NotFoundView.vue"

import HomeNavigation from "./containers/HomeNavigation.vue"
import NamedParticipantsForm from "./containers/NamedParticipantsForm.vue"
import NumberedParticipantsForm from "./containers/NumberedParticipantsForm.vue"
import StoredBracketList from "./containers/StoredBracketList.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      component: HomeView,
      children: [
        {
          name: "home",
          path: "/",
          component: HomeNavigation,
        },
        {
          name: "named-participants-form",
          path: "/participants-form/named",
          component: NamedParticipantsForm,
        },
        {
          name: "numbered-participants-form",
          path: "/participants-form/numbered",
          component: NumberedParticipantsForm,
        },
        {
          name: "local-brackets",
          path: "/bracket/local",
          component: StoredBracketList,
        },
      ],
    },
    {
      name: "bracket-detail",
      path: "/bracket/local/:id",
      component: BracketView,
    },
    {
      name: "not-found",
      path: "*",
      component: NotFoundView,
    },
  ],
})
