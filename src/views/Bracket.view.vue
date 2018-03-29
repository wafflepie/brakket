<template>
<div>
  <h2 v-if="!winner">Enter the scores</h2>
  <h2 v-if="winner">{{ winner.name }} is the winner of this bracket!</h2>
  <div class="bracket">
    <div v-for="(round, roundIndex) of results" :key="roundIndex" class="round">
      <div v-for="(match, matchIndex) of round" :key="matchIndex" class="match">
        <side
          side="home"
          :match="match"
          :round-index="roundIndex"
          :match-index="matchIndex"
          @score-change="handleScoreChange"
          @score-blur="handleScoreBlur" />
        <side
          side="away"
          :match="match"
          :round-index="roundIndex"
          :match-index="matchIndex"
          @score-change="handleScoreChange"
          @score-blur="handleScoreBlur" />
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

  handleScoreBlur() {
    this.$store.dispatch(actionTypes.VALIDATE_RESULTS)
    this.$store.dispatch(actionTypes.STORE_CURRENT_STATE)
  }
}
</script>

<style scoped>
.bracket {
  display: flex;
  justify-content: center;
  position: relative;
}

.round {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 2rem;
}

.match {
  align-items: center;
  background-color: white;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  min-width: 12rem;
}
</style>
