<template>
  <modal
    adaptive
    name="share">
    Here is the spectator URL, non-destructive!
    <input
      :value="spectatorAccessUrl"
      class="spectator-input"
      readonly
      @focus="copy(spectatorAccessUrl)">
    <transition name="fade">
      <span
        v-show="showCopiedToClipboard"
        class="copied-to-clipboard">Copied to clipboard!</span>
    </transition>
  </modal>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

@Component
export default class ShareModal extends Vue {
  showCopiedToClipboard = false

  get spectatorAccessUrl() {
    return this.spectatorAccess
      ? window.location.href
          .split("/")
          .slice(0, -1)
          .join("/") + `/${this.spectatorAccess.token}`
      : ""
  }

  get spectatorAccess() {
    return this.$store.state.tournament.accesses.spectator
  }

  copy(url) {
    this.$copyText(url).then(() => {
      this.showCopiedToClipboard = true

      setTimeout(() => {
        this.showCopiedToClipboard = false
      }, 3000)
    })
  }
}
</script>


<style lang="scss">
.v--modal {
  background-color: $background-color;
  border-radius: 0;
  padding: 0.5rem;
}

.v--modal-overlay {
  background-color: $share-modal-overlay-color;

  // HACK: If you are scrolled all the way to the top on macOS devies
  // and you try to scroll more, the browser sort of "tries to scroll more".
  // This makes it so that the color above is consistent with the overlay
  top: -9999px;
  padding-top: 9999px;
  // (2*) does the same thing as the hack above, but for the bottom part
  height: calc(100vh + 2 * 9999px);
}

.spectator-input {
  max-width: 100%;
}
</style>
