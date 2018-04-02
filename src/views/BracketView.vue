<template>
  <main>
    <section v-if="!bracketId">
      <h2>This bracket does not exist :(</h2>
    </section>
    <section v-if="bracketId">
      <h2>{{ bracketName || 'Unnamed bracket' }}</h2>
      <h3 v-if="!winner">Enter the the results by editing the scores below</h3>
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
    </section>
  </main>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator"
import * as R from "ramda"

import { actionTypes, mutationTypes, initialState } from "../store"
import { createExtendMatch } from "../utils"
import MatchSide from "../components/MatchSide.vue"

@Component({
  components: { MatchSide },
  created() {
    this.loadBracket()
  },
  destroyed() {
    this.resetBracket()
  },
})
export default class BracketView extends Vue {
  get results() {
    const { participants, results, seed } = this.$store.state.bracket
    const extendMatch = createExtendMatch(participants, results, seed)
    return R.map(R.map(extendMatch), results)
  }

  get winner() {
    const finalMatch = R.last(R.defaultTo([], R.last(this.results)))
    return R.path([R.prop("winner", finalMatch)], finalMatch)
  }

  get bracketName() {
    return this.$store.state.bracket.name
  }

  get bracketId() {
    return this.$store.state.bracket.id
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
