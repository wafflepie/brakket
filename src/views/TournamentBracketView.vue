<template>
  <main>
    <section v-if="!tournamentId">
      <h2>This bracket does not exist :(</h2>
    </section>
    <section v-if="tournamentId">
      <h2>{{ tournamentName || 'Unnamed tournament' }}</h2>
      <h3 v-if="!winner">Enter the results by editing the scores below</h3>
      <h3 v-if="winner">
        <AirHorn />{{ winner.name }} is the winner of this tournament!<AirHorn />
      </h3>
      <TournamentBracket />
      <div :class="{ invisible: !isShuffleShown }">
        <GhostButton :on-click="shuffle">Not happy with the seed? Shuffle!</GhostButton>
      </div>
    </section>
  </main>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator"
import * as R from "ramda"

import { actionTypes, mutationTypes, initialState } from "../store"
import {
  selectMatchesWithScores,
  selectWinnerSideOfFinalMatch,
} from "../selectors"
import AirHorn from "../components/AirHorn.vue"
import GhostButton from "../components/GhostButton.vue"
import TournamentBracket from "../containers/TournamentBracket.vue"

@Component({
  components: { AirHorn, GhostButton, TournamentBracket },
  created() {
    this.loadTournament()
  },
  destroyed() {
    this.resetTournamentState()
  },
})
export default class TournamentBracketView extends Vue {
  get tournamentId() {
    return this.$store.state.tournament.id
  }

  get tournamentName() {
    return this.$store.state.tournament.name
  }

  get isShuffleShown() {
    return R.isEmpty(selectMatchesWithScores(this.$store.state))
  }

  get winner() {
    return selectWinnerSideOfFinalMatch(this.$store.state)
  }

  @Watch("$route")
  loadTournament() {
    this.$store.dispatch(
      actionTypes.LOAD_TOURNAMENT_BY_KEY,
      this.$route.params.id
    )
  }

  resetTournamentState() {
    this.$store.commit(
      mutationTypes.INITIALIZE_TOURNAMENT_STATE,
      initialState.tournament
    )
  }

  shuffle() {
    this.$store.dispatch(actionTypes.SHUFFLE)
  }
}
</script>

<style lang="scss" scoped>
h3 {
  line-height: 1.1rem;
  margin-bottom: 0;
}

.invisible {
  visibility: hidden;
}
</style>
