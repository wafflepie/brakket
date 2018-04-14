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
      <SubmitButton
        v-if="value.length"
        :on-click="submit">PROCEED</SubmitButton>
    </transition>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import SubmitButton from "../components/SubmitButton.vue"
import { mutationTypes } from "../store"

@Component({ components: { SubmitButton } })
export default class TournamentNameForm extends Vue {
  value = ""

  submit() {
    this.$store.commit(mutationTypes.SET_TOURNAMENT_NAME, this.value)
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-duration;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
