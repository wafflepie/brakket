<template>
  <div>
    <BracketNameForm v-if="!isBracketNameSet" />
    <form v-if="isBracketNameSet">
      <div v-for="(input, index) of inputs" :key="index">
        <input v-model="input.value" />
        <button @click="removeInput(input)" type="button">X</button>
      </div>
      <button @click="addInput()" type="button">Add another field</button>
      <button @click.prevent="submit()" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import Vue from "vue"
import { Component } from "vue-property-decorator"
import * as R from "ramda"

import BracketNameForm from "./BracketNameForm.view.vue"
import { actionTypes } from "../store"

@Component({ components: { BracketNameForm } })
export default class NamedParticipantsForm extends Vue {
  inputs = R.times(this.createEmptyInput, 4)

  get isBracketNameSet() {
    return !!this.$store.state.bracket.name
  }

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
