<template>
  <form>
    <label for="numbered-participants-input">
      NUMBER OF PARTICIPANTS (2-64)
    </label>
    <input
      id="numbered-participants-input"
      :value="value"
      autocomplete="off"
      placeholder="2"
      type="number"
      @change="handleInputChange($event.target.value)">
    <SubmitButton :on-click="submit">CREATE BRACKET</SubmitButton>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import * as R from "ramda"

import SubmitButton from "../components/SubmitButton"
import ResetNameMixin from "../mixins/ResetNameMixin"
import { actionTypes } from "../store"

@Component({ components: { SubmitButton }, mixins: [ResetNameMixin] })
export default class NumberedParticipantsForm extends Vue {
  value = ""

  submit() {
    this.handleInputChange(this.value)

    this.$store.dispatch(
      actionTypes.GENERATE_NEW_BRACKET,
      R.times(index => `Team ${index + 1}`, Number(this.value))
    )
  }

  handleInputChange(value) {
    this.value = `${R.clamp(2, 64, value)}`
  }
}
</script>
