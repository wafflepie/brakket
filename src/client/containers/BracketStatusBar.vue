<template>
  <nav class="status-bar">
    <ShareModal />
    <span
      v-show="online"
      class="connection-status online">
      {{ clientCount - 1 }} other viewer{{ clientCount - 2 ? 's' : '' }}
    </span>
    <span
      v-show="!online"
      class="connection-status offline">
      Offline
    </span>
    <span
      class="status-bar-button"
      @click="showShareModal">
      <icon name="share" />
    </span>
    <span
      :class="['status-bar-button', { disabled: !canShuffle }]"
      :tabindex="canShuffle ? 0 : ''"
      @click="shuffle">
      <icon name="random" />
    </span>
  </nav>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator"
import * as R from "ramda"

import { selectMatchesWithScores } from "../selectors"
import { actionTypes } from "../store"
import ShareModal from "./ShareModal.vue"

@Component({ components: { ShareModal } })
export default class BracketStatusBar extends Vue {
  get online() {
    return this.$store.state.online
  }

  get clientCount() {
    return this.$store.state.tournament.transient.clientCount
  }

  get canShuffle() {
    return R.isEmpty(selectMatchesWithScores(this.$store.state))
  }

  showShareModal() {
    this.$modal.show("share")
  }

  @Watch("$route")
  hideShareModal() {
    this.$modal.hide("share")
  }

  shuffle() {
    this.canShuffle && this.$store.dispatch(actionTypes.SHUFFLE)
  }
}
</script>

<style lang="scss" scoped>
.status-bar {
  background-color: $bracket-status-bar-color;
  display: inline-block;
  height: $bracket-status-bar-height;
  left: 0;
  line-height: $bracket-status-bar-height;
  max-height: $bracket-status-bar-height;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2;

  // HACK: If you are scrolled all the way to the top on macOS devies
  // and you try to scroll more, the browser sort of "tries to scroll more".
  // This makes it so that the color above is consistent with the status-bar
  top: -9999px;
  padding-top: 9999px;

  .connection-status {
    &::before {
      content: "●";
      display: inline-block;
    }

    &.online::before {
      color: $online-color;
    }

    &.offline::before {
      color: $offline-color;
    }
  }
}

.status-bar-button {
  cursor: pointer;
  margin: 0 0.5rem;

  &.disabled {
    filter: brightness(0.2);
    cursor: not-allowed;
  }
}
</style>
