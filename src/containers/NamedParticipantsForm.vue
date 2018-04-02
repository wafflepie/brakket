<template>
  <form>
    <ul>
      <li
        v-for="(input, index) of inputs" 
        :key="index">
        <input
          v-model="input.value"
          :placeholder="`Team ${index + 1}`">
        <RemoveButton :on-click="() => removeInput(input)">X</RemoveButton>
      </li>
    </ul>
    <GhostButton :on-click="addInput">ADD FIELD</GhostButton>
    <SubmitButton :on-click="submit">CREATE BRACKET</SubmitButton>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import * as R from "ramda"

import GhostButton from "../components/GhostButton.vue"
import RemoveButton from "../components/RemoveButton.vue"
import SubmitButton from "../components/SubmitButton.vue"
import ResetNameMixin from "../mixins/ResetNameMixin"
import { actionTypes } from "../store"

@Component({
  components: { GhostButton, RemoveButton, SubmitButton },
  mixins: [ResetNameMixin],
})
export default class NamedParticipantsForm extends Vue {
  inputs = R.times(this.createEmptyInput, 4)

  createEmptyInput() {
    return { value: "" }
  }

  addInput() {
    this.inputs = [...this.inputs, this.createEmptyInput()]
  }

  removeInput(input) {
    this.inputs = this.inputs.filter(element => element !== input)
  }

  submit() {
    const participants = this.inputs
      .map(input => input.value)
      .map((value, index) => value || `Team ${index + 1}`)

    participants.length &&
      this.$store.dispatch(actionTypes.GENERATE_NEW_BRACKET, participants)
  }
}
</script>

<style lang="scss" scoped>
form {
  margin-bottom: $section-margin;
}

input {
  display: inline-block;
}

li {
  margin-bottom: 2 * $list-item-margin;
}

:not(input) + button {
  margin-top: $section-margin;
}
</style>
