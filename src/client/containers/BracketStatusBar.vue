<template>
  <div class="status-bar-container">
    <nav class="status-bar">
      <ShareModal />
      <div class="clients">
        <span
          v-tooltip="{ content: getTooltipContent(client), trigger: 'hover' }"
          v-for="client of clients"
          :key="client.id"
          :style="{ color: getColorById(client.id) }"
          class="client-icon">
          <icon
            :name="getIconById(client.id)"
            scale="2" />
        </span>
      </div>
      <span
        v-show="online"
        class="connection-status online">
        Online
      </span>
      <span
        v-show="!online"
        class="connection-status offline">
        Offline
      </span>
      <div class="status-bar-buttons">
        <span
          :class="['status-bar-button', { disabled: !canShare }]"
          title="Share the tournament"
          @click="showShareModal">
          <icon name="share" />
        </span>
        <span
          :class="['status-bar-button', { disabled: !canShuffle }]"
          :tabindex="canShuffle ? 0 : ''"
          title="Shuffle the initial seed"
          @click="shuffle">
          <icon name="random" />
        </span>
      </div>
    </nav>
  </div>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator"
import * as R from "ramda"

import { PERMISSIONS } from "../../common"
import { selectMatchesWithScores, selectAccess } from "../selectors"
import { actionTypes } from "../store"
import { getColorById } from "../utils"
import ShareModal from "./ShareModal.vue"

@Component({ components: { ShareModal } })
export default class BracketStatusBar extends Vue {
  getColorById = getColorById

  icons = [
    "baseball-ball",
    "basketball-ball",
    "bowling-ball",
    "football-ball",
    "volleyball-ball",
  ]

  get online() {
    return this.$store.state.online
  }

  get clients() {
    const clients = this.$store.state.tournament.transient.clients

    // orders the clients by permissions
    return [
      ...Object.values(PERMISSIONS).reduce(
        (array, permission) => [
          ...array,
          ...clients.filter(client => client.permissions === permission),
        ],
        []
      ),
    ]
  }

  get canShuffle() {
    const access = selectAccess(this.$store.state)

    if (!access || access.permissions === PERMISSIONS.SPECTATOR) {
      return false
    }

    return R.isEmpty(selectMatchesWithScores(this.$store.state))
  }

  get canShare() {
    return !!this.$store.state.tournament.accesses.spectator
  }

  showShareModal() {
    this.canShare && this.$modal.show("share")
  }

  @Watch("$route")
  hideShareModal() {
    this.$modal.hide("share")
  }

  shuffle() {
    this.canShuffle && this.$store.dispatch(actionTypes.SHUFFLE)
  }

  getIconById(id) {
    const color = getColorById(id)
    return this.icons[parseInt(color.slice(1), 16) % this.icons.length]
  }

  getTooltipContent(client) {
    return client.name || `Anonymous ${client.permissions.toLowerCase()}`
  }
}
</script>

<style lang="scss" scoped>
.status-bar-container {
  background-color: $status-bar-color;
  height: $status-bar-height;
  left: 0;
  line-height: $status-bar-height;
  max-height: $status-bar-height;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
}

.status-bar {
  display: flex;
  flex-wrap: nowrap;
  max-width: 100vw;
  width: 100vw;

  .clients {
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    height: 100%;
    justify-content: flex-end;

    .client-icon {
      padding: 0 $client-icon-margin;
      position: relative;

      svg {
        height: 100%;
      }
    }
  }

  .connection-status {
    padding: 0 $status-bar-button-margin;
    white-space: nowrap;

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

  .status-bar-buttons {
    flex-basis: 0;
    flex-grow: 1;
    text-align: left;
    white-space: nowrap;

    .status-bar-button {
      cursor: pointer;
      height: 100%;
      margin: 0 $status-bar-button-margin;
      vertical-align: middle;

      &.disabled {
        filter: brightness(0.2);
        cursor: not-allowed;
      }
    }
  }
}

@media screen and (min-width: $mobile-breakpoint) {
  .status-bar .connection-status {
    padding: 0 $status-bar-height;
  }
}
</style>

<style lang="scss">
.tooltip {
  font-size: $client-tooltip-font-size;
  z-index: 2;

  .tooltip-inner {
    display: inline-block;
    background-color: $status-bar-color;
    pointer-events: none;
    padding: 0 0.5em;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }
}
</style>
