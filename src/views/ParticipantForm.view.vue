<template>
<main>
  <section class="title-section">
    <h1>Enter the names of participants</h1>
  </section>
  <section class="form-section">
    <div v-for="(input, index) of inputs" :key="index">
      <input v-model="input.value" />
      <button @click="removeInput(input)">X</button>
    </div>
    <button @click="addInput()">Add another field</button>
    <button @click="submit()" type="submit">Submit</button>
  </section>
</main>
</template>

<script>
import Vue from "vue"
import Component from "vue-class-component"

import { actionTypes } from "../store"

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
    this.inputs = [...this.inputs, { value: "" }]
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

<style scoped>
main {
  box-shadow: 0px 0px 20px -10px gray;
  display: flex;
  margin: 3rem auto 0 auto;
  max-width: 992px;
}

section {
  flex-basis: 0;
  flex-grow: 1;
  padding: 3rem;
}

.title-section {
  background: lightgreen;
}

.form-section {
  background: white;
}
</style>
