<template>
  <form>
    <div 
      v-for="(input, index) of inputs" 
      :key="index">
      <input
        v-model="input.value"
        :placeholder="`Team ${index + 1}`">
      <button 
        class="remove-button"
        type="button"
        @click="removeInput(input)">X</button>
    </div>
    <button 
      class="add-new-field-button"
      type="button"
      @click="addInput()">Add another field</button>
    <button 
      class="submit-button with-arrow"
      type="submit"
      @click.prevent="submit()">Submit</button>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import * as R from "ramda"

import ResetNameMixin from "../mixins/ResetName.mixin"
import { actionTypes } from "../store"

@Component({ mixins: [ResetNameMixin] })
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
      .filter(value => value)

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
  margin-bottom: $list-item-margin;
}

.add-new-field-button {
  margin-top: $section-margin;
}
</style>
