<template>
  <form>
    <label for="tournament-name">
      TOURNAMENT NAME
    </label>
    <input
      id="tournament-name"
      v-model="value"
      autocomplete="off"
      placeholder="Foosball Playoffs">
    <transition name="fade">
      <button
        v-if="value.length"
        class="submit-button with-arrow"
        type="submit"
        @click.prevent="submit()">PROCEED</button>
    </transition>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import { mutationTypes } from "../store"

@Component
export default class BracketNameForm extends Vue {
  value = ""

  submit() {
    this.$store.commit(mutationTypes.SET_BRACKET_NAME, this.value)
  }
}
</script>
