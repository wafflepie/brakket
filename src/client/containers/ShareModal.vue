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
          for="spectator-input">Click to copy a view-only link that you can send to the spectators</label>
        <input
          v-tooltip.bottom-end="{
            classes: 'copied-tooltip',
            content: 'Link copied!',
            show: isAccessCopied(spectatorAccess),
            trigger: 'manual',
          }"
          id="spectator-input"
          :value="createUrlFromToken(spectatorAccess && spectatorAccess.token)"
          readonly
          @focus="copy(createUrlFromToken(spectatorAccess && spectatorAccess.token))">
      </div>
      <div
        v-if="isCreator"
        v-show="selectedTab === PERMISSIONS.ORGANIZER"
        id="organizers-container">
        <table v-if="organizerAccesses.length">
          <thead>
            <tr>
              <th>NAME</th>
              <th>TOKEN</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="organizerAccess of organizerAccesses"
              :key="organizerAccess.token">
              <td>
                <input 
                  :id="`organizer-name-input-${organizerAccess.token}`"
                  :disabled="!online"
                  :value="organizerAccess.name"
                  class="organizer-name-input"
                  placeholder="Organizer"
                  @change="handleNameChange(organizerAccess, $event.target.value)">
              </td>
              <td>
                <input
                  v-if="!isAccessCopied(organizerAccess)"
                  :id="`organizer-url-input-${organizerAccess.token}`"
                  :value="organizerAccess.token"
                  class="organizer-url-input"
                  readonly
                  @focus="copy(createUrlFromToken(organizerAccess.token))">
                <div
                  v-else
                  class="copied">
                  Link copied!
                </div>
              </td>
              <td>
                <RemoveItemButton
                  :disabled="!online"
                  :on-click="() => removeOrganizer(organizerAccess.token)" />
              </td>
            </tr>
          </tbody>
        </table>
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

  copiedUrl = null
  copiedTimeout = null

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

  isAccessCopied(access) {
    return this.copiedUrl && this.copiedUrl.includes(access && access.token)
  }

  copy(url) {
    clearTimeout(this.copiedTimeout)

    this.$copyText(url).then(() => {
      this.copiedUrl = url

      this.copiedTimeout = setTimeout(() => {
        this.copiedUrl = null
      }, 1500)
    })
  }

  handleTabSelect(tab) {
    this.selectedTab = tab
    this.copiedUrl = null

    clearTimeout(this.copiedTimeout)
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
  line-height: initial;
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

  #spectator-input {
    max-width: 100%;
  }
}

#organizers-container {
  #add-organizer-button-container {
    text-align: right;

    #add-organizer-button {
      width: 100%;
    }
  }

  .copied {
    color: $primary-color;
    cursor: default;
  }

  table {
    width: 100%;

    thead tr {
      border-bottom: 1px solid gray;
      line-height: $label-line-height;

      th {
        cursor: default;
        font-weight: 400;
      }
    }

    td {
      padding-right: $table-cell-padding;

      &:last-child {
        padding-right: 0;
      }
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
