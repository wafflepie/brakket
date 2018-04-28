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
        :value="createUrlFromToken(spectatorAccess && spectatorAccess.token)"
        readonly
        @focus="copy(createUrlFromToken(spectatorAccess && spectatorAccess.token))">
    </div>
    <div
      v-if="isCreator"
      id="organizers-container">
      <div
        v-for="organizerAccess of organizerAccesses"
        :key="organizerAccess.token">
        <input 
          :value="organizerAccess.name"
          @change="handleNameChange(organizerAccess, $event.target.value)">
        <input
          :value="createUrlFromToken(organizerAccess.token)"
          class="organizer-input"
          readonly
          @focus="copy(createUrlFromToken(organizerAccess.token))">
        <RemoveItemButton :on-click="() => removeOrganizer(organizerAccess.token)" />
      </div>
      <button @click="addOrganizer">Add new organizer</button>

    </div>
  </modal>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import RemoveItemButton from "../components/RemoveItemButton.vue"
import { actionTypes } from "../store"
import { selectAccess } from "../selectors"
import { PERMISSIONS } from "../../common"

@Component({ components: { RemoveItemButton }})
export default class ShareModal extends Vue {
  showCopied = false

  get spectatorAccess() {
    return this.$store.state.tournament.accesses.spectator
  }

  get isCreator() {
    const access = selectAccess(this.$store.state)
    return access && access.permissions === PERMISSIONS.CREATOR
  }

  get organizerAccesses() {
    return this.$store.state.tournament.accesses.organizers
  }

  addOrganizer(){
    this.$socket.emit("addOrganizer")
  }

  removeOrganizer(token){
    this.$socket.emit("removeOrganizer", token)
  }

  createUrlFromToken(token) {
    return token
      ? window.location.href
          .split("/")
          .slice(0, -1)
          .join("/") + `/${token}`
      : ""
  }

  copy(url) {
    this.$copyText(url).then(() => {
      this.showCopied = true

      setTimeout(() => {
        this.showCopied = false
      }, 3000)
    })
  }

  handleNameChange(access, value){
    this.$store.dispatch(actionTypes.UPDATE_ORGANIZER_NAME, {
      access,
      value
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
