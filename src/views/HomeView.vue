<template>
  <main>
    <router-view v-if="!isRouteParticipantsForm || isTournamentNameSet" />
    <TournamentNameForm v-else />
  </main>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import TournamentNameForm from "../containers/TournamentNameForm.vue"

@Component({ components: { TournamentNameForm } })
export default class HomeView extends Vue {
  get isRouteParticipantsForm() {
    return /participants-form/.test(this.$route.name)
  }

  get isTournamentNameSet() {
    return !!this.$store.state.tournament.name
  }
}
</script>


<style lang="scss" scoped>
main {
  margin: 0 auto;
  max-width: $home-width;
  text-align: center;
}
</style>
