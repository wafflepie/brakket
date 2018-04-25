<template>
  <form>
    <label for="tournament-name">
      TOURNAMENT NAME
    </label>
    <input
      id="tournament-name"
      v-model="value"
      autocomplete="off"
      placeholder="e.g. Foosball Playoffs">
    <transition name="fade">
      <GhostSubmitButton
        v-if="value.length"
        :on-click="submit">PROCEED</GhostSubmitButton>
    </transition>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import GhostSubmitButton from "../components/GhostSubmitButton.vue"
import { mutationTypes } from "../store"

@Component({ components: { GhostSubmitButton } })
export default class TournamentNameForm extends Vue {
  value = ""

  submit() {
    this.$store.commit(mutationTypes.SET_TOURNAMENT_NAME, this.value)
  }
}
</script>
