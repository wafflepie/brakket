<template>
  <div id="home-container">
    <router-view v-if="!isRouteParticipantsForm || isTournamentNameSet" />
    <TournamentNameForm v-else />
  </div>
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
    return !!this.$store.state.tournament.domain.name
  }
}
</script>


<style lang="scss" scoped>
#home-container {
  margin: 0 auto;
  max-width: $home-width;
  padding-bottom: $section-margin;
  text-align: center;
}
</style>
