<template>
  <div :class="[{ winner: match.winner === side }, 'side', side]">
    <div
      v-if="isSidePlaceholder(match, side)"
      class="side-name placeholder">
      Placeholder
    </div>
    <div 
      v-else-if="isSideToBeDecided(match, side)"
      class="side-name to-be-decided">
      TBD
    </div>
    <div
      v-else
      class="side-name">
      {{ match[side].name }}
    </div>
    <input      
      :disabled="isSideDisabled(match, side)"
      :value="isSideDisabled(match, side) ? '' : match[side].score"
      type="number"
      @change="$emit('score-change', roundIndex, matchIndex, side, $event.target.value)"
      @blur="$emit('score-blur')" >
  </div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator"

import * as utils from "../utils"

@Component
export default class Side extends Vue {
  @Prop(Object) match
  @Prop(String) side
  @Prop(Number) roundIndex
  @Prop(Number) matchIndex

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
  font-size: 1em;
  left: 1px;
  outline: none;
  position: relative;
  text-align: right;
  width: 4em;
}

input:not(:disabled) {
  border-right: 1px solid black;
}

.winner input {
  font-weight: bold;
}
</style>
