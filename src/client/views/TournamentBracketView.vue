<template>
  <div>
    <BracketStatusBar />
    <section v-if="!isCreated">
      <h2 v-if="!loading">This bracket does not exist :(</h2>
      <h2 v-if="loading">Loading your tournament...</h2>
    </section>
    <section v-if="!loading && isCreated">
      <h2>{{ tournamentName || 'Unnamed tournament' }}</h2>
      <h3 v-if="!winner">Enter the results by editing the scores below</h3>
      <h3 v-if="winner">
        <AirHorn />{{ winner.name }} is the winner of this tournament!<AirHorn />
      </h3>
      <TournamentBracket />
    </section>
  </div>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator"

import { actionTypes, mutationTypes, initialState } from "../store"
import { selectWinnerSideOfFinalMatch } from "../selectors"
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
    this.resetTournamentState()
  },
})
export default class TournamentBracketView extends Vue {
  get loading() {
    return this.$store.state.tournament.transient.loading
  }

  get isCreated() {
    return !!this.$store.state.tournament.local.created
  }

  get tournamentName() {
    return this.$store.state.tournament.domain.name
  }

  get winner() {
    return selectWinnerSideOfFinalMatch(this.$store.state)
  }

  @Watch("$route")
  loadTournament() {
    this.$store.dispatch(
      actionTypes.LOAD_TOURNAMENT_BY_TOKEN,
      this.$route.params.token
    )
  }

  resetTournamentState() {
    this.$store.commit(
      mutationTypes.INITIALIZE_TOURNAMENT_STATE,
      initialState.tournament
    )
  }
}
</script>

<style lang="scss" scoped>
h3 {
  line-height: 1.1rem;
  margin-bottom: 0;
}
</style>
