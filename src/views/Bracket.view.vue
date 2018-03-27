<template>
<div>
  <h1>Bracket</h1>
  <h2 v-if="winner">Winner: {{ winner.name }}, score: {{ winner.score }}.</h2>
  <div class="bracket">
    <div v-for="(round, roundIndex) of results" :key="roundIndex" class="round">
      <div v-for="(match, matchIndex) of round" :key="matchIndex" class="match">
        <side
          side="home"
          :match="match"
          :round-index="roundIndex"
          :match-index="matchIndex"
          @score-change="handleScoreChange"
          @input-blur="handleInputBlur" />
        <div class="versus">
          vs.
        </div>
        <side
          side="away"
          :match="match"
          :round-index="roundIndex"
          :match-index="matchIndex"
          @score-change="handleScoreChange"
          @input-blur="handleInputBlur" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vue from "vue"
import Component from "vue-class-component"
import * as R from "ramda"

import { actionTypes, mutationTypes } from "../store"
import { createExtendMatch } from "../utils"
import Side from "../components/Side.component.vue"

@Component({
  created() {
    this.$store.dispatch(actionTypes.LOAD_BRACKET_BY_KEY, this.$route.params.id)
  },
  components: { side: Side },
})
export default class Bracket extends Vue {
  get results() {
    const { participants, results, seed } = this.$store.state
    const extendMatch = createExtendMatch(participants, results, seed)
    return R.map(R.map(extendMatch), results)
  }

  get winner() {
    const finalMatch = R.last(R.defaultTo([], R.last(this.results)))
    return R.path([R.prop("winner", finalMatch)], finalMatch)
  }

  handleScoreChange(roundIndex, matchIndex, side, score) {
    this.$store.commit(mutationTypes.CHANGE_SIDE_SCORE, {
      roundIndex,
      matchIndex,
      side,
      score,
    })
  }

  handleInputBlur() {
    this.$store.dispatch(actionTypes.STORE_CURRENT_STATE)
  }
}
</script>

<style scoped>
.bracket {
  display: flex;
  justify-content: space-around;
}

.round {
  display: flex;
  flex-direction: column;
}

.match {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
