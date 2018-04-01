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
      @blur="$emit('score-blur')">
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

<style lang="scss" scoped>
.side {
  background-color: #181818;
  display: flex;
  flex-direction: row;
  width: 100%;

  input {
    background: none;
    border: none;
    color: white;
    font-size: 1em;
    left: 1px;
    outline: none;
    position: relative;
    text-align: right;
    width: 4em;
  }
}

.winner {
  $brightness: 1.2;
  $color: gold / $brightness;
  color: $color;
  filter: brightness($brightness);

  input {
    color: $color;
  }
}

.side-name {
  flex-grow: 1;
  padding: 0.3em;
}

.placeholder {
  color: #333;
}

.to-be-decided {
  color: #999;
}
</style>
