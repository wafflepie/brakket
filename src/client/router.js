import Vue from "vue"
import Router from "vue-router"

import TournamentBracketView from "./views/TournamentBracketView.vue"
import HomeView from "./views/HomeView.vue"
import NotFoundView from "./views/NotFoundView.vue"

import HomeNavigation from "./containers/HomeNavigation.vue"
import NamedParticipantsForm from "./containers/NamedParticipantsForm.vue"
import NumberedParticipantsForm from "./containers/NumberedParticipantsForm.vue"
import StoredTournamentList from "./containers/StoredTournamentList.vue"

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
          name: "local-tournaments",
          path: "/tournament",
          component: StoredTournamentList,
        },
      ],
    },
    {
      name: "tournament-bracket",
      path: "/tournament/:id",
      component: TournamentBracketView,
    },
    {
      name: "not-found",
      path: "*",
      component: NotFoundView,
    },
  ],
})
