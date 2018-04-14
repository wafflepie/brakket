<template>
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
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import { actionTypes, mutationTypes } from "../store"
import { selectResults } from "../selectors"
import MatchSide from "../components/MatchSide.vue"

@Component({ components: { MatchSide } })
export default class BracketView extends Vue {
  get results() {
    return selectResults(this.$store.state)
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
    this.$store.dispatch(actionTypes.ENSURE_TOURNAMENT_STATE_VALIDITY)
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
