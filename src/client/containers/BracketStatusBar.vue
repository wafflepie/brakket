<template>
  <nav class="status-bar">
    <span
      v-if="online"
      class="connection-status online">
      Online, {{ clientCount }} total viewer{{ clientCount - 1 ? 's' : '' }}
    </span>
    <span
      v-else
      class="connection-status offline">
      Offline
    </span>
  </nav>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

@Component
export default class BracketStatusBar extends Vue {
  get online() {
    return this.$store.state.online
  }

  get clientCount() {
    return this.$store.state.tournament.transient.clientCount
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

  .connection-status::before {
    content: "●";
    display: inline-block;
  }
}

.online::before {
  color: $online-color;
}

.offline::before {
  color: $offline-color;
}
</style>
