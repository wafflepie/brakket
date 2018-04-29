<template>
  <form>
    <ul>
      <li
        v-for="(input, index) of inputs" 
        :key="input.key">
        <input
          v-model="input.value"
          :placeholder="`Team ${index + 1}`">
        <RemoveItemButton :on-click="() => removeInput(input)">X</RemoveItemButton>
      </li>
    </ul>
    <GhostButton :on-click="addInput">ADD FIELD</GhostButton>
    <GhostSubmitButton :on-click="submit">CREATE</GhostSubmitButton>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import * as R from "ramda"

import {
  MINIMUM_PARTICIPANTS_COUNT,
  MAXIMUM_PARTICIPANTS_COUNT,
} from "../constants"
import GhostButton from "../components/GhostButton.vue"
import RemoveItemButton from "../components/RemoveItemButton.vue"
import GhostSubmitButton from "../components/GhostSubmitButton.vue"
import ResetNameMixin from "../mixins/ResetNameMixin"
import { actionTypes } from "../store"

@Component({
  components: { GhostButton, RemoveItemButton, GhostSubmitButton },
  mixins: [ResetNameMixin],
})
export default class NamedParticipantsForm extends Vue {
  inputs = R.times(this.createEmptyInput, 4)

  createEmptyInput() {
    return { value: "", key: Math.random() }
  }

  addInput() {
    if (this.inputs.length < MAXIMUM_PARTICIPANTS_COUNT) {
      this.inputs = [...this.inputs, this.createEmptyInput()]
    }
  }

  removeInput(input) {
    if (this.inputs.length > MINIMUM_PARTICIPANTS_COUNT) {
      this.inputs = this.inputs.filter(element => element !== input)
    }
  }

  submit() {
    const participants = this.inputs
      .map(input => input.value)
      .map((value, index) => value || `Team ${index + 1}`)

    participants.length &&
      this.$store.dispatch(actionTypes.GENERATE_NEW_TOURNAMENT, participants)
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
  display: flex;
  margin-bottom: $list-item-margin;
}

ul + button::before {
  content: "+ ";
}

:not(input) + button {
  margin-top: $section-margin;
}
</style>
