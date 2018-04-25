<template>
  <article class="bracket">
    <BracketBranches :results="results" />
    <article
      v-for="(round, roundIndex) of results"
      :key="roundIndex"
      class="round">
      <article
        v-for="(match, matchIndex) of round"
        :key="matchIndex"
        class="match">
        <MatchSide
          :disabled="isSpectator"
          :match="match"
          :round-index="roundIndex"
          :match-index="matchIndex"
          side="home"
          @score-change="handleScoreChange"
          @score-blur="handleScoreBlur" />
        <MatchSide
          :disabled="isSpectator"
          :match="match"
          :round-index="roundIndex"
          :match-index="matchIndex"
          side="away"
          @score-change="handleScoreChange"
          @score-blur="handleScoreBlur" />
      </article>
    </article>
  </article>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import { PERMISSIONS } from "../../common"
import { actionTypes } from "../store"
import { selectResults, selectAccess } from "../selectors"
import MatchSide from "../components/MatchSide.vue"
import BracketBranches from "../components/BracketBranches.vue"

@Component({ components: { BracketBranches, MatchSide } })
export default class BracketView extends Vue {
  get results() {
    return selectResults(this.$store.state)
  }

  get isSpectator() {
    return selectAccess(this.$store.state).permissions === PERMISSIONS.SPECTATOR
  }

  handleScoreChange(roundIndex, matchIndex, side, score) {
    this.$store.dispatch(actionTypes.UPDATE_TOURNAMENT_SCORE, {
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
  margin: $section-margin 0;
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
  margin-top: $match-margin;
  margin-bottom: $match-margin;
  width: $match-width;
}

@media screen and (min-width: $mobile-breakpoint) {
  .round {
    margin: 0 (4 * $round-margin);
  }

  .match {
    width: $match-width * 1.5;
  }
}
</style>
