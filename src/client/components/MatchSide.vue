<template>
  <article
    :class="[{ winner: match.winner === side }, 'side', side]"
    :style="{ 'border-color': focusId ? getColorById(focusId) : 'transparent' }">
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
      :disabled="disabled || isSideDisabled(match, side)"
      :value="isSideDisabled(match, side) ? '' : match[side].score"
      type="number"
      @change="$emit('score-change', match.roundIndex, match.matchIndex, side, $event.target.value)"
      @blur="$emit('score-blur')"
      @focus="$emit('score-focus', match.roundIndex, match.matchIndex, side)">
  </article>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator"

import { isSideDisabled, isSidePlaceholder, isSideToBeDecided } from "../domain"
import { getColorById } from "../utils"

@Component
export default class MatchSide extends Vue {
  @Prop(Boolean) disabled
  @Prop(String) focusId
  @Prop(Object) match
  @Prop(String) side

  getColorById = getColorById
  isSideDisabled = isSideDisabled
  isSidePlaceholder = isSidePlaceholder
  isSideToBeDecided = isSideToBeDecided
}
</script>

<style lang="scss" scoped>
.side {
  background-color: $side-background-color;
  border: 2px solid transparent;
  display: flex;
  flex-direction: row;
  padding: $side-padding;
  width: 100%;

  &.home {
    border-bottom-width: 0;
  }

  &.away {
    border-top-width: 0;
  }

  &.winner {
    background-color: $side-background-color * $winner-brightness;
    color: $primary-color;

    input {
      color: $primary-color;
    }
  }

  input {
    border: 1px solid transparent;
    font-size: 100%;
    padding: 0;
    text-align: right;
    width: $score-input-width;

    &:not(:disabled) {
      background-color: $background-color;
      border-color: $bracket-branch-color;
    }

    &:focus {
      border-color: $border-inactive-color;
    }
  }
}

.side-name {
  flex-grow: 1;
  max-width: calc(100% - #{$score-input-width});
  overflow: hidden;
  text-overflow: ellipsis;

  &.placeholder {
    color: $side-placeholder-color;
  }

  &.to-be-decided {
    color: $side-to-be-decided-color;
  }
}
</style>
