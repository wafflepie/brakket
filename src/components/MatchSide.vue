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
export default class MatchSide extends Vue {
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
  background-color: $side-background-color;
  display: flex;
  flex-direction: row;
  padding: $side-padding;
  width: 100%;

  input {
    background: none;
    border: none;
    font-size: 100%;
    padding: initial;
    text-align: right;
    width: $score-input-width;
  }
}

.winner {
  color: $primary-color / $winner-brightness;
  filter: brightness($winner-brightness);

  input {
    color: $primary-color / $winner-brightness;
  }
}

.side-name {
  flex-grow: 1;
}

.placeholder {
  color: $side-placeholder-color;
}

.to-be-decided {
  color: $side-to-be-decided-color;
}
</style>
