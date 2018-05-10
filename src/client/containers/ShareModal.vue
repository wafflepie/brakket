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
            id="spectator-copied">Copied!</span>
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
          class="organizer-container">
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
        <transition name="fade">
          <span
            v-show="showCopied"
            id="organizer-copied">Copied!</span>
        </transition>
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
        <label
          id="creator-name-label"
          for="creator-name-input">Enter your name here!</label>
        <input
          id="creator-name-input"
          :disabled="!online"
          :value="creatorAccess.name"
          placeholder="Wenceslaus I, Duke of Bohemia"
          @change="handleNameChange(creatorAccess, $event.target.value)">
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
    this.showCopied = false
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

#tab-container {
  ul {
    display: flex;

    li {
      flex-grow: 1;
      cursor: pointer;
      text-align: center;

      &.active {
        background-color: $tab-active-color;
      }

      &:hover:not(.active) {
        background-color: $tab-active-color * 0.5;
      }
    }
  }
}

#modal-content-container {
  display: flex;
  padding: $modal-padding;

  & > * {
    align-self: center;
    width: 100%;
  }
}

#spectator-container {
  #spectator-label {
    display: inline-block;
    font-size: $font-size;
  }

  #spectator-copied {
    color: $primary-color;
    float: right;
  }

  #spectator-input {
    cursor: pointer;
    max-width: 100%;
  }
}

#organizers-container {
  .organizer-name-input {
    flex-grow: 1;
  }

  .organizer-url-input {
    cursor: pointer;
    flex-grow: 1;
    text-overflow: ellipsis;
  }

  #organizer-copied {
    bottom: 0;
    color: $primary-color;
    left: $modal-padding;
    position: absolute;
  }

  #add-organizer-button-container {
    text-align: right;

    #add-organizer-button {
      width: 100%;
    }
  }

  .organizer-container {
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

    & ~ #add-organizer-button-container {
      margin-top: $modal-padding;

      #add-organizer-button {
        width: auto;
      }
    }
  }
}

#creator-container {
  #creator-name-label {
    display: inline-block;
    font-size: $font-size;
  }

  #creator-name-input {
    flex-grow: 1;
    max-width: none;
  }
}
</style>
