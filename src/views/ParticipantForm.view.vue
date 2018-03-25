<template>
  <div>
    <h1>Enter the names!</h1>
    <div v-for="(input, index) of inputs" :key="index">
      <input v-model="input.value" />
      <button @click="removeInput(input)">X</button>
    </div>
    <button @click="addInput()">Add another field</button>
    <button @click="submit()" type="submit">Submit</button>
  </div>
</template>

<script>
import Vue from "vue"
import Component from "vue-class-component"

import { actionTypes } from "../store"
import { getParticipantsFromInputs } from "../utils"

@Component({
  created() {
    Array(4)
      .fill()
      .forEach(this.addInput)
  },
})
export default class ParticipantForm extends Vue {
  inputs = []

  addInput() {
    this.inputs.push({
      value: "",
    })
  }

  removeInput(input) {
    this.inputs = this.inputs.filter(element => element !== input)
  }

  submit() {
    const participants = getParticipantsFromInputs(this.inputs)
    this.$store.dispatch(actionTypes.GENERATE_NEW_BRACKET, participants)
  }
}
</script>
