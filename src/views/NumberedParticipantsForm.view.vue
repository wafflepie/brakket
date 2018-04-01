<template>
  <form>
    <label for="numbered-participants-input">
      NUMBER OF PARTICIPANTS
    </label>
    <input
      id="numbered-participants-input"
      :value="value"
      autocomplete="off"
      placeholder="8"
      type="number"
      @change="handleInputChange($event.target.value)">
    <button 
      class="submit-button with-arrow"
      type="submit"
      @click.prevent="submit()">CREATE BRACKET</button>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import * as R from "ramda"

import ResetNameMixin from "../mixins/ResetName.mixin"
import { actionTypes } from "../store"

@Component({ mixins: [ResetNameMixin] })
export default class NumberedParticipantsForm extends Vue {
  value = ""

  submit() {
    this.$store.dispatch(
      actionTypes.GENERATE_NEW_BRACKET,
      R.times(index => `Team ${index + 1}`, Number(this.value))
    )
  }

  handleInputChange(value) {
    this.value = R.clamp(1, 64, value)
  }
}
</script>
