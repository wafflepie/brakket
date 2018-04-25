<template>
  <modal
    name="share">
    Share the tournament with anyone!
    spectator: {{ spectatorAccess ? spectatorAccess.token : "None" }}
  </modal>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

@Component
export default class ShareModal extends Vue {
  get spectatorAccess(){
    return this.$store.state.tournament.accesses.spectator
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
</style>
