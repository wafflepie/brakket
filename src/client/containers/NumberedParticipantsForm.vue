<template>
  <form>
    <label for="numbered-participants-input">
      NUMBER OF PARTICIPANTS ({{ min }}-{{ max }})
    </label>
    <input
      id="numbered-participants-input"
      :value="value"
      :placeholder="min"
      autocomplete="off"
      type="number"
      @change="handleInputChange($event.target.value)">
    <GhostSubmitButton :on-click="submit">CREATE</GhostSubmitButton>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import * as R from "ramda"

import {
  MINIMUM_PARTICIPANTS_COUNT,
  MAXIMUM_PARTICIPANTS_COUNT,
} from "../../common"
import GhostSubmitButton from "../components/GhostSubmitButton"
import ResetNameMixin from "../mixins/ResetNameMixin"
import { actionTypes } from "../store"

@Component({ components: { GhostSubmitButton }, mixins: [ResetNameMixin] })
export default class NumberedParticipantsForm extends Vue {
  value = ""
  min = MINIMUM_PARTICIPANTS_COUNT
  max = MAXIMUM_PARTICIPANTS_COUNT

  submit() {
    this.handleInputChange(this.value)

    this.$store.dispatch(
      actionTypes.GENERATE_NEW_TOURNAMENT,
      R.times(index => `Team ${index + 1}`, Number(this.value))
    )
  }

  handleInputChange(value) {
    this.value = `${R.clamp(this.min, this.max, value)}`
  }
}
</script>
