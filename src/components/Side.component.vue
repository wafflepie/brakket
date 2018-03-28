<template>
<div :class="[{ winner: match.winner === side }, 'side', side]">
  <div class="side-name placeholder" v-if="isSidePlaceholder(match, side)">
    Placeholder
  </div>
  <div class="side-name to-be-decided" v-else-if="isSideToBeDecided(match, side)">
    TBD
  </div>
  <div class="side-name exists" v-else>
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
