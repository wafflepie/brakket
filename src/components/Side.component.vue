<template>
<div :class="[{ winner: match.winner === side }, 'side', side]">
  <div class="side-name placeholder" v-if="isSidePlaceholder(match, side)">
    Placeholder
  </div>
  <div class="side-name to-be-decided" v-else-if="isSideToBeDecided(match, side)">
    TBD
  </div>
  <div class="side-name" v-else>
    {{ match[side].name }}
  </div>
  <input
    type="number"
    :disabled="isSideDisabled(match, side)"
    :value="isSideDisabled(match, side) ? '' : match[side].score"
    @change="$emit('score-change', roundIndex, matchIndex, side, $event.target.value)"
    @blur="$emit('input-blur')" />
</div>
</template>

<script>
import Vue from "vue"
import Component from "vue-class-component"

import * as utils from "../utils"

@Component({
  props: ["match", "side", "roundIndex", "matchIndex"],
})
export default class Side extends Vue {
  isSideDisabled = utils.isSideDisabled
  isSidePlaceholder = utils.isSidePlaceholder
  isSideToBeDecided = utils.isSideToBeDecided
}
</script>

<style scoped>
.side {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.winner {
  background-color: lightgreen;
  font-weight: bold;
}

.side-name {
  flex-grow: 1;
  padding: 0.3em;
  text-align: left;
}

.placeholder {
  color: lightgray;
}

input {
  background-color: transparent;
  border: none;
  outline: none;
  text-align: right;
  width: 4em;
}

input:not(:disabled) {
  border-bottom: 1px solid black;
}
</style>
