<template>
  <div>
    <BracketStatusBar />
    <section v-if="!tournamentIsLoaded">
      <h2 v-if="!loading">This bracket does not exist :(</h2>
      <h2 v-if="loading">Loading your tournament...</h2>
    </section>
    <section v-if="!loading && tournamentIsLoaded">
      <h2>{{ tournamentName || 'Unnamed tournament' }}</h2>
      <h3 v-if="!winnerSide">Enter the results by editing the scores below</h3>
      <h3 v-if="winnerSide">
        <AirHorn />
        <div class="winner-announcement">
          {{ winnerSide.name }} is the winner of this tournament!
        </div>
        <AirHorn />
      </h3>
      <TournamentBracket />
    </section>
  </div>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator"

import { actionTypes } from "../store"
import { selectWinnerSideOfFinalMatch, selectTournamentIsLoaded } from "../selectors"
import AirHorn from "../components/AirHorn.vue"
import BracketStatusBar from "../containers/BracketStatusBar.vue"
import GhostButton from "../components/GhostButton.vue"
import TournamentBracket from "../containers/TournamentBracket.vue"

@Component({
  components: { AirHorn, BracketStatusBar, GhostButton, TournamentBracket },
  created() {
    this.loadTournament()
  },
  destroyed() {
    this.closeTournament()
  },
})
export default class TournamentBracketView extends Vue {
  get loading() {
    return this.$store.state.tournament.transient.loading
  }

  get tournamentIsLoaded() {
    return selectTournamentIsLoaded(this.$store.state)
  }

  get tournamentName() {
    return this.$store.state.tournament.domain.name
  }

  get winnerSide() {
    return selectWinnerSideOfFinalMatch(this.$store.state)
  }

  @Watch("$route")
  handleTournamentChange() {
    this.closeTournament()
    this.loadTournament()
  }

  loadTournament() {
    this.$store.dispatch(actionTypes.LOAD_TOURNAMENT_BY_TOKEN, this.$route.params.token)
  }

  closeTournament() {
    this.$store.dispatch(actionTypes.CLOSE_CURRENT_TOURNAMENT)
  }
}
</script>

<style lang="scss" scoped>
h3 {
  display: flex;
  line-height: $winner-title-line-height;
  justify-content: center;
  margin-bottom: 0;
}
</style>
