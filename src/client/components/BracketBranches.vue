<template>
  <!-- Root coordinate system-->
  <svg
    v-if="isModernBrowser"
    class="root-svg"
    height="100%"
    width="100%"
    viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <!-- Coordinate system for the rounds -->
    <svg
      v-for="(round, roundIndex) of results"
      :key="roundIndex"
      :x="(roundIndex / results.length) * 100"
      :width="100 / results.length + 0.1 /* HACK: to make the line junction look better */"
      viewBox="0 0 100 100"
      preserveAspectRatio="none">
      <!-- Horizontal line coming out of the right side of a match if home is the winner -->
      <line
        v-for="(match, matchIndex) of round"
        v-if="isOutwardLineShown(match, 'home')"
        :key="'home-outward-line-' + matchIndex"
        :y1="getHorizontalLineY(round, match, 'home')"
        :y2="getHorizontalLineY(round, match, 'home')"
        class="line horizontal"
        x1="100"
        x2="50"
        vector-effect="non-scaling-stroke" />
      <!-- Horizontal line coming out of the right side of a match if away is the winner -->
      <line
        v-for="(match, matchIndex) of round"
        v-if="isOutwardLineShown(match, 'away')"
        :key="'away-outward-line-' + matchIndex"
        :y1="getHorizontalLineY(round, match, 'away')"
        :y2="getHorizontalLineY(round, match, 'away')"
        class="line horizontal"
        x1="100"
        x2="50"
        vector-effect="non-scaling-stroke" />
      <!-- Horizontal line coming to the left home side of a match if it is filled by a participant -->
      <line
        v-for="(match, matchIndex) of round"
        v-if="isInwardLineShown(match, 'home')"
        :key="'home-inward-line-' + matchIndex"
        :y1="getHorizontalLineY(round, match, 'home')"
        :y2="getHorizontalLineY(round, match, 'home')"
        class="line horizontal"
        x1="50"
        x2="0"
        vector-effect="non-scaling-stroke" />
      <!-- Horizontal line coming to the left away side of a match if it is filled by a participant -->
      <line
        v-for="(match, matchIndex) of round"
        v-if="isInwardLineShown(match, 'away')"
        :key="'away-inward-line-' + matchIndex"
        :y1="getHorizontalLineY(round, match, 'away')"
        :y2="getHorizontalLineY(round, match, 'away')"
        class="line horizontal"
        x1="50"
        x2="0"
        vector-effect="non-scaling-stroke" />
      <!-- Vertical line connecting the home inward line with the appropriate outward line -->
      <line
        v-for="(match, matchIndex) of round"
        v-if="isVerticalLineShown(match, 'home')"
        :key="'home-vertical-line-' + matchIndex"
        :y1="getHorizontalLineY(round, match, 'home')"
        :y2="getPreviousMatchHorizontalLineY(round, match, 'home')"
        class="line vertical"
        x1="0"
        x2="0"
        vector-effect="non-scaling-stroke" />
      <!-- Vertical line connecting the away inward line with the appropriate outward line -->
      <line
        v-for="(match, matchIndex) of round"
        v-if="isVerticalLineShown(match, 'away')"
        :key="'away-vertical-line-' + matchIndex"
        :y1="getHorizontalLineY(round, match, 'away')"
        :y2="getPreviousMatchHorizontalLineY(round, match, 'away')"
        class="line vertical"
        x1="0"
        x2="0"
        vector-effect="non-scaling-stroke" />
    </svg>
  </svg>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator"

import {
  isSidePlaceholder,
  isSideToBeDecided,
  getPreviousMatchBySide,
} from "../domain"

@Component
export default class BracketBranches extends Vue {
  @Prop(Array) results

  get isModernBrowser() {
    // FIXME: vector-effect not working in IE and Edge
    return !document.documentMode && !/Edge/.test(navigator.userAgent)
  }

  isInwardLineShown(match, side) {
    return (
      !isSidePlaceholder(match, side) &&
      !isSideToBeDecided(match, side) &&
      match.roundIndex !== 0
    )
  }

  isOutwardLineShown(match, side) {
    return match.winner === side && match.roundIndex !== this.results.length - 1
  }

  isVerticalLineShown(match, side) {
    const previousMatch = getPreviousMatchBySide(this.results, match, side)

    return (
      this.isInwardLineShown(match, side) &&
      this.isOutwardLineShown(previousMatch, previousMatch.winner)
    )
  }

  getHorizontalLineY(round, match, side) {
    return (
      match.matchIndex / round.length * 100 +
      100 / round.length * 0.5 +
      (side === "away" ? 1 : -1) / this.results[0].length * 20
    )
  }

  getPreviousMatchHorizontalLineY(round, match, side) {
    const previousMatch = getPreviousMatchBySide(this.results, match, side)

    return this.getHorizontalLineY(
      this.results[previousMatch.roundIndex],
      previousMatch,
      previousMatch.winner
    )
  }
}
</script>

<style lang="scss" scoped>
.root-svg {
  position: absolute;
  z-index: -1;
}

.line {
  stroke: $bracket-branch-color;
  stroke-width: $bracket-branch-line-width;
}

.vertical {
  stroke-width: 2 * $bracket-branch-line-width;
}
</style>
