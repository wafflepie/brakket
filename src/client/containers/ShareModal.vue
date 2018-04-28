<template>
  <modal
    adaptive
    height="auto"
    name="share">
    <div id="spectator-container">
      <label
        id="spectator-label"
        for="spectator-input">Click to get a view-only link!</label>
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
      id="creator-only-container">
      <div class="access-container">
        <input
          :value="creatorAccess.name"
          class="creator-name-input"
          placeholder="Enter your name here!"
          @change="handleNameChange(creatorAccess, $event.target.value)">
      </div>
      <div
        v-for="organizerAccess of organizerAccesses"
        :key="organizerAccess.token"
        class="access-container">
        <input 
          :value="organizerAccess.name"
          class="organizer-name-input"
          placeholder="Organizer name"
          @change="handleNameChange(organizerAccess, $event.target.value)">
        <input
          :value="organizerAccess.token"
          class="organizer-url-input"
          readonly
          @focus="copy(createUrlFromToken(organizerAccess.token))">
        <RemoveItemButton :on-click="() => removeOrganizer(organizerAccess.token)" />
      </div>
      <GhostButton
        id="add-organizer-button"
        :on-click="addOrganizer">+ ADD ORGANIZER</GhostButton>
    </div>
  </modal>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import GhostButton from "../components/GhostButton.vue"
import RemoveItemButton from "../components/RemoveItemButton.vue"
import { actionTypes } from "../store"
import { selectAccess } from "../selectors"
import { PERMISSIONS } from "../../common"

@Component({ components: { GhostButton, RemoveItemButton } })
export default class ShareModal extends Vue {
  showCopied = false

  get isCreator() {
    const access = selectAccess(this.$store.state)
    return access && access.permissions === PERMISSIONS.CREATOR
  }

  get creatorAccess() {
    return this.$store.state.tournament.accesses.creator
  }

  get organizerAccesses() {
    return this.$store.state.tournament.accesses.organizers
  }

  get spectatorAccess() {
    return this.$store.state.tournament.accesses.spectator
  }

  addOrganizer() {
    this.$socket.emit("addOrganizer")
  }

  removeOrganizer(token) {
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

  handleNameChange(access, value) {
    this.$store.dispatch(actionTypes.UPDATE_ACCESS_NAME, {
      access,
      value,
    })
  }
}
</script>


<style lang="scss">
.v--modal {
  background-color: $background-color;
  border: 1px solid $border-inactive-color;
  border-radius: 0;
  padding: 1rem;
}

.v--modal-overlay {
  background-color: $share-modal-overlay-color;
}

.hidden {
  visibility: hidden;
}

label {
  font-size: $font-size;
}

input {
  border-right: transparent;
}

#spectator-label {
  display: inline-block;
}

#copied {
  float: right;
}

#spectator-input {
  max-width: 100%;
}

#creator-only-container {
  margin-top: $section-margin;
}

.access-container {
  display: flex;

  & > * {
    flex-basis: 0;
    margin: 0.5rem 0.5rem;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .organizer-name-input {
    flex-grow: 1;
  }

  .organizer-url-input {
    flex-grow: 1;
  }
}

#add-organizer-button {
  float: right;
  margin-top: 1rem;
}

.creator-name-input {
  flex-grow: 1;
  max-width: none;
}
</style>
