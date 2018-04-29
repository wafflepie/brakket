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
          :focus-id="getFocusId(roundIndex, matchIndex)"
          :match="match"
          side="home"
          @score-change="handleScoreChange"
          @score-blur="handleScoreBlur"
          @score-focus="handleScoreFocus" />
        <MatchSide
          :disabled="isSpectator"
          :focus-id="getFocusId(roundIndex, matchIndex)"
          :match="match"
          side="away"
          @score-change="handleScoreChange"
          @score-blur="handleScoreBlur"
          @score-focus="handleScoreFocus" />
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

  getFocusId(roundIndex, matchIndex) {
    const clients = this.$store.state.tournament.transient.clients.filter(
      client =>
        client.focus &&
        client.focus.roundIndex === roundIndex &&
        client.focus.matchIndex === matchIndex
    )

    // NOTE: although multiple clients might be focusing the same input,
    // we return just the first one
    return clients.length ? clients[0].id : null
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
    this.$socket.emit("scoreBlur")
  }

  handleScoreFocus(roundIndex, matchIndex, side) {
    this.$socket.emit("scoreFocus", { roundIndex, matchIndex, side })
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
    margin: 0 (2 * $round-margin);
  }

  .match {
    width: $match-width * 1.5;
  }
}
</style>
