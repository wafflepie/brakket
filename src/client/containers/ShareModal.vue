<template>
  <modal
    adaptive
    height="auto"
    name="share">
    <nav
      v-if="isCreator"
      id="tab-container">
      <ul>
        <li
          :class="{ active: selectedTab === PERMISSIONS.SPECTATOR }"
          @click="handleTabSelect(PERMISSIONS.SPECTATOR)">SPECTATORS</li>
        <li
          :class="{ active: selectedTab === PERMISSIONS.ORGANIZER }"
          @click="handleTabSelect(PERMISSIONS.ORGANIZER)">ORGANIZERS</li>
        <li
          :class="{ active: selectedTab === PERMISSIONS.CREATOR }"
          @click="handleTabSelect(PERMISSIONS.CREATOR)">YOU</li>
      </ul>
    </nav>
    <div id="modal-content-container">
      <div
        v-show="selectedTab === PERMISSIONS.SPECTATOR"
        id="spectator-container">
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
        v-show="selectedTab === PERMISSIONS.ORGANIZER"
        id="organizers-container">
        <div
          v-for="organizerAccess of organizerAccesses"
          :key="organizerAccess.token"
          class="access-container">
          <label :for="`organizer-name-input-${organizerAccess.token}`">NAME</label>
          <input 
            :id="`organizer-name-input-${organizerAccess.token}`"
            :disabled="!online"
            :value="organizerAccess.name"
            class="organizer-name-input"
            placeholder="Organizer"
            @change="handleNameChange(organizerAccess, $event.target.value)">
          <label :for="`organizer-url-input-${organizerAccess.token}`">TOKEN</label>
          <input
            :id="`organizer-url-input-${organizerAccess.token}`"
            :value="organizerAccess.token"
            class="organizer-url-input"
            readonly
            title="Unique access token, click to copy the entire URL!"
            @focus="copy(createUrlFromToken(organizerAccess.token))">
          <RemoveItemButton
            :disabled="!online"
            :on-click="() => removeOrganizer(organizerAccess.token)" />
        </div>
        <div id="add-organizer-button-container">
          <GhostButton
            v-show="online"
            id="add-organizer-button"
            :on-click="addOrganizer">+ ADD ORGANIZER</GhostButton>
        </div>
      </div>
      <div
        v-if="isCreator"
        v-show="selectedTab === PERMISSIONS.CREATOR"
        id="creator-container">
        <div class="access-container">
          <label
            id="creator-name-label"
            for="creator-name-input">CREATOR NAME</label>
          <input
            id="creator-name-input"
            :disabled="!online"
            :value="creatorAccess.name"
            placeholder="Enter your name here!"
            @change="handleNameChange(creatorAccess, $event.target.value)">
        </div>
      </div>
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

// TODO: improve design (use tabs for spectator and organizers)
@Component({ components: { GhostButton, RemoveItemButton } })
export default class ShareModal extends Vue {
  PERMISSIONS = PERMISSIONS

  showCopied = false
  selectedTab = PERMISSIONS.SPECTATOR

  get online() {
    return this.$store.state.online
  }

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

  handleTabSelect(tab) {
    this.selectedTab = tab
  }

  handleNameChange(access, value) {
    this.$store.dispatch(actionTypes.UPDATE_ACCESS_NAME, {
      access,
      name: value,
    })
  }
}
</script>


<style lang="scss" scoped>
input {
  border-right: none;
}

#spectator-label {
  display: inline-block;
  font-size: $font-size;
}

#copied {
  color: $primary-color;
  float: right;
}

#spectator-input {
  cursor: pointer;
  max-width: 100%;
}

#creator-name-label {
  white-space: nowrap;
}

#creator-name-input {
  flex-grow: 1;
  max-width: none;
}

.access-container {
  display: flex;

  & > * {
    flex-basis: 0;
    margin: $organizer-margin $organizer-margin / 2;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  label {
    align-self: center;
    margin: 0 $organizer-margin;
  }

  .organizer-name-input {
    flex-grow: 1;
  }

  .organizer-url-input {
    cursor: pointer;
    flex-grow: 1;
  }
}

#add-organizer-button {
  margin-top: $modal-padding;
}

#tab-container {
  ul {
    display: flex;

    li {
      flex-grow: 1;
      flex-basis: 0;
      cursor: pointer;
      text-align: center;

      &.active {
        background-color: $active-tab-color;
      }
    }
  }
}

#modal-content-container {
  padding: $modal-padding;
}

#add-organizer-button-container {
  text-align: right;
}
</style>
