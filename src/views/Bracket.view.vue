<template>
  <div>
    <h1>Bracket</h1>
    <div class="bracket">
      <div v-for="(round, roundIndex) of results" :key="roundIndex" class="round">
        <div v-for="(match, matchIndex) of round" :key="matchIndex" class="match">
          <div :class="[{ winner: match.winner === 'home' }, 'side', 'home']">
            <div class="side-name">
              {{ match.home.name || 'TBD' }}
            </div>
            <input
              type="number"
              :value="match.home.score"
              @change="handleScoreChange(roundIndex, matchIndex, 'home', $event.target.value)" />
          </div>
          <div class="versus">
            vs.
          </div>
          <div :class="[{ winner: match.winner === 'away' }, 'side', 'away']">
            <input
              type="number"
              :value="match.away.score"
              @change="handleScoreChange(roundIndex, matchIndex, 'away', $event.target.value)" />
            <div class="side-name">
              {{ match.away.name || 'TBD' }}
            </div>
          </div>
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
import { extendMatchSidesWithNames, extendMatchWithWinnerSide } from "../utils"

@Component({
  created() {
    this.$store.dispatch(actionTypes.LOAD_BRACKET_BY_KEY, this.$route.params.id)
  },
})
export default class Bracket extends Vue {
  get results() {
    const { participants, results, seed } = this.$store.state

    const extendMatch = R.o(
      extendMatchSidesWithNames(participants, results, seed),
      extendMatchWithWinnerSide
    )

    return R.map(R.map(extendMatch), results)
  }

  handleScoreChange(roundIndex, matchIndex, side, score) {
    this.$store.commit(mutationTypes.CHANGE_SIDE_SCORE, {
      roundIndex,
      matchIndex,
      side,
      score,
    })
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

.winner {
  color: red;
}
</style>
