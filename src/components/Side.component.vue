<template>
<div :class="[{ winner: match.winner === side }, 'side', side]">
  <div class="side-name placeholder" v-if="isPlaceholder(match, side)">
    Placeholder
  </div>
  <div class="side-name to-be-decided" v-else-if="isToBeDecided(match, side)">
    TBD
  </div>
  <div class="side-name exists" v-else>
    {{ match[side].name }}
  </div>
  <input
    type="number"
    :disabled="isDisabled(match, side)"
    :value="isDisabled(match, side) ? '' : match[side].score"
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
  isDisabled(match, side) {
    return side === "home"
      ? utils.isHomeDisabled(match)
      : utils.isAwayDisabled(match)
  }

  isPlaceholder(match, side) {
    return side === "home"
      ? utils.isHomePlaceholder(match)
      : utils.isAwayPlaceholder(match)
  }

  isToBeDecided(match, side) {
    return side === "home"
      ? utils.isHomeToBeDecided(match)
      : utils.isAwayToBeDecided(match)
  }
}
</script>

<style scoped>
.winner {
  color: red;
}

.side {
  display: flex;
  flex-direction: column;
}

.side.away .side-name {
  order: 1;
}
</style>
