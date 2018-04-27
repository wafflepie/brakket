<template>
  <modal
    adaptive
    height="auto"
    name="share">
    <div id="spectator-container">
      <label
        id="spectator-label"
        for="spectator-input">Click the URL below to get a view-only link!</label>
      <transition name="fade">
        <span
          v-show="showCopied"
          id="copied">Copied!</span>
      </transition>
      <input
        id="spectator-input"
        :value="spectatorAccessUrl"
        readonly
        @focus="copy(spectatorAccessUrl)">
    </div>
    <div
      v-if="isCreator"
      id="organizers-container">
      TODO: ORGANIZERS CONTAINER
    </div>
  </modal>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import { selectAccess } from "../selectors"
import { PERMISSIONS } from "../../common"

@Component
export default class ShareModal extends Vue {
  showCopied = false

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

  get isCreator() {
    const access = selectAccess(this.$store.state)
    return access && access.permissions === PERMISSIONS.CREATOR
  }

  copy(url) {
    this.$copyText(url).then(() => {
      this.showCopied = true

      setTimeout(() => {
        this.showCopied = false
      }, 3000)
    })
  }
}
</script>


<style lang="scss">
.v--modal {
  background-color: $background-color;
  border: 1px solid $border-active-color;
  border-radius: 0;
  padding: 1rem;
}

.v--modal-overlay {
  background-color: $share-modal-overlay-color;
}

#spectator-input {
  max-width: 100%;
}

#spectator-label {
  display: inline-block;
}

#copied {
  float: right;
  font-size: $label-font-size;
}
</style>
