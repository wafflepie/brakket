<template>
  <main>
    <section v-if="!bracketId">
      <h2>This bracket does not exist :(</h2>
    </section>
    <section v-if="bracketId">
      <h2>{{ bracketName || 'Unnamed bracket' }}</h2>
      <h3 v-if="!winner">Enter the results by editing the scores below</h3>
      <h3 v-if="winner">{{ winner.name }} is the winner of this bracket!</h3>
      <div class="bracket">
        <div 
          v-for="(round, roundIndex) of results" 
          :key="roundIndex" 
          class="round">
          <div 
            v-for="(match, matchIndex) of round" 
            :key="matchIndex" 
            class="match">
            <MatchSide
              :match="match"
              :round-index="roundIndex"
              :match-index="matchIndex"
              side="home"
              @score-change="handleScoreChange"
              @score-blur="handleScoreBlur" />
            <MatchSide
              :match="match"
              :round-index="roundIndex"
              :match-index="matchIndex"
              side="away"
              @score-change="handleScoreChange"
              @score-blur="handleScoreBlur" />
          </div>
        </div>
      </div>
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
  extendAllMatches,
  filterMatchesWithScores,
  getFinalMatch,
  getWinnerSideOfExtendedMatch,
} from "../utils"
import GhostButton from "../components/GhostButton.vue"
import MatchSide from "../components/MatchSide.vue"

@Component({
  components: { GhostButton, MatchSide },
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
    const { results } = this.$store.state.bracket
    return R.isEmpty(filterMatchesWithScores(results))
  }

  get results() {
    const { participants, results, seed } = this.$store.state.bracket
    return extendAllMatches(participants, results, seed)
  }

  get winner() {
    const finalMatch = getFinalMatch(this.results)
    return getWinnerSideOfExtendedMatch(finalMatch)
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

  handleScoreChange(roundIndex, matchIndex, side, score) {
    this.$store.commit(mutationTypes.CHANGE_SIDE_SCORE, {
      roundIndex,
      matchIndex,
      side,
      score,
    })
  }

  handleScoreBlur() {
    this.$store.dispatch(actionTypes.VALIDATE_RESULTS)
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: $section-margin;
}

.bracket {
  display: inline-flex;
  position: relative;
  text-align: left;
}

.round {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 $round-margin;
}

.match {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: $match-margin;
  width: $match-width;
}

.shuffle {
  font-size: 0.8em;
  margin-top: $section-margin - $match-margin;
}

@media screen and (min-width: $mobile-breakpoint) {
  .round {
    margin: 0 (2 * $round-margin);
  }

  .match {
    margin-bottom: 2 * $match-margin;
    width: $match-width * 1.5;
  }
}
</style>
