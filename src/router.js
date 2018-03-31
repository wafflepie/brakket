import Vue from "vue"
import Router from "vue-router"

import Bracket from "./views/Bracket.view.vue"
import Home from "./views/Home.view.vue"
import NotFound from "./views/NotFound.view.vue"

import HomeNavigation from "./views/HomeNavigation.view.vue"
import NamedParticipantsForm from "./views/NamedParticipantsForm.view.vue"
import NumberedParticipantsForm from "./views/NumberedParticipantsForm.view.vue"
import StoredBracketList from "./views/StoredBracketList.view.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      component: Home,
      children: [
        {
          name: "home-navigation",
          path: "/",
          component: HomeNavigation,
        },
        {
          name: "named-participants",
          path: "/named-participants",
          component: NamedParticipantsForm,
        },
        {
          name: "numbered-participants",
          path: "/numbered-participants",
          component: NumberedParticipantsForm,
        },
        {
          name: "stored-brackets",
          path: "/stored-brackets",
          component: StoredBracketList,
        },
      ],
    },
    {
      name: "bracket",
      path: "/bracket/:id",
      component: Bracket,
    },
    {
      name: "not-found",
      path: "*",
      component: NotFound,
    },
  ],
})
