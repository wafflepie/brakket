<template>
  <main>
    <section v-if="!bracketId">
      <h2>This bracket does not exist :(</h2>
    </section>
    <section v-if="bracketId">
      <h2>{{ bracketName || 'Unnamed bracket' }}</h2>
      <h3 v-if="!winner">Enter the results by editing the scores below</h3>
      <h3 v-if="winner">{{ winner.name }} is the winner of this bracket!</h3>
      <TournamentBracket />
      <div
        v-if="isShuffleShown"
        class="shuffle">
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
import GhostButton from "../components/GhostButton.vue"
import TournamentBracket from "../containers/TournamentBracket.vue"

@Component({
  components: { GhostButton, TournamentBracket },
  created() {
    this.loadBracket()
  },
  destroyed() {
    this.resetBracket()
  },
})
export default class BracketView extends Vue {
  get bracketId() {
    return this.$store.state.bracket.id
  }

  get bracketName() {
    return this.$store.state.bracket.name
  }

  get isShuffleShown() {
    return R.isEmpty(selectMatchesWithScores(this.$store.state))
  }

  get winner() {
    return selectWinnerSideOfFinalMatch(this.$store.state)
  }

  @Watch("$route")
  loadBracket() {
    this.$store.dispatch(actionTypes.LOAD_BRACKET_BY_KEY, this.$route.params.id)
  }

  resetBracket() {
    this.$store.commit(
      mutationTypes.INITIALIZE_BRACKET_STATE,
      initialState.bracket
    )
  }

  shuffle() {
    this.$store.dispatch(actionTypes.SHUFFLE)
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: $section-margin;
}
</style>
