<template>
  <div>
    <h1>Bracket</h1>
    <h2 v-if="winner">Winner: {{ winner.name }}, score: {{ winner.score }}.</h2>
    <div class="bracket">
      <div v-for="(round, roundIndex) of results" :key="roundIndex" class="round">
        <div v-for="(match, matchIndex) of round" :key="matchIndex" class="match">
          <div :class="[{ winner: match.winner === 'home' }, 'side', 'home']">
            <div class="side-name placeholder" v-if="isHomePlaceholder(match)">
              Placeholder
            </div>
            <div class="side-name to-be-decided" v-else-if="isHomeToBeDecided(match)">
              TBD
            </div>
            <div class="side-name exists" v-else>
              {{ match.home.name }}
            </div>
            <input
              type="number"
              :disabled="isHomeDisabled(match)"
              :value="isHomeDisabled(match) ? '' : match.home.score"
              @change="handleScoreChange(roundIndex, matchIndex, 'home', $event.target.value)" />
          </div>
          <div class="versus">
            vs.
          </div>
          <div :class="[{ winner: match.winner === 'away' }, 'side', 'away']">
            <input
              type="number"
              :disabled="isAwayDisabled(match)"
              :value="isAwayDisabled(match) ? '' : match.away.score"
              @change="handleScoreChange(roundIndex, matchIndex, 'away', $event.target.value)" />
            <div class="side-name">
              <span v-if="isAwayPlaceholder(match)">
                Placeholder
              </span>
              <span v-else-if="isAwayToBeDecided(match)">
                TBD
              </span>
              <span v-else>
                {{ match.away.name }}
              </span>
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
import * as utils from "../utils"

@Component({
  created() {
    this.$store.dispatch(actionTypes.LOAD_BRACKET_BY_KEY, this.$route.params.id)
  },
})
export default class Bracket extends Vue {
  isHomePlaceholder = utils.isHomePlaceholder
  isAwayPlaceholder = utils.isAwayPlaceholder
  isHomeToBeDecided = utils.isHomeToBeDecided
  isAwayToBeDecided = utils.isAwayToBeDecided
  isHomeDisabled = utils.isHomeDisabled
  isAwayDisabled = utils.isAwayDisabled

  get results() {
    const { participants, results, seed } = this.$store.state
    const extendMatch = utils.createExtendMatch(participants, results, seed)
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
