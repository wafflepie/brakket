<template>
  <form>
    <div 
      v-for="(input, index) of inputs" 
      :key="index">
      <input v-model="input.value">
      <button 
        type="button"
        @click="removeInput(input)">X</button>
    </div>
    <button 
      type="button"
      @click="addInput()">Add another field</button>
    <button 
      type="submit"
      @click.prevent="submit()">Submit</button>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import * as R from "ramda"

import { actionTypes } from "../store"

@Component
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
