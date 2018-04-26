<template>
  <article :class="[{ winner: match.winner === side }, 'side', side]">
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
      @change="$emit('score-change', roundIndex, matchIndex, side, $event.target.value)"
      @blur="$emit('score-blur')"
      @focus="$emit('score-focus', roundIndex, matchIndex, side)">
  </article>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator"

import { isSideDisabled, isSidePlaceholder, isSideToBeDecided } from "../domain"

@Component
export default class MatchSide extends Vue {
  @Prop(Boolean) disabled
  @Prop(Object) match
  @Prop(String) side
  @Prop(Number) roundIndex
  @Prop(Number) matchIndex

  isSideDisabled = isSideDisabled
  isSidePlaceholder = isSidePlaceholder
  isSideToBeDecided = isSideToBeDecided
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
      border-color: $border-color-inactive;
    }
  }
}

.winner {
  background-color: $side-background-color * $winner-brightness;
  color: $primary-color;

  input {
    color: $primary-color;
  }
}

.side-name {
  flex-grow: 1;
  max-width: calc(100% - #{$score-input-width});
  overflow: hidden;
  text-overflow: ellipsis;
}

.placeholder {
  color: $side-placeholder-color;
}

.to-be-decided {
  color: $side-to-be-decided-color;
}
</style>
