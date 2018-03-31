<template>
  <form>
    Set bracket name
    <input v-model="value" />
    <button @click.prevent="submit()" type="submit">Submit</button>
  </form>
</template>

<script>
import Vue from "vue"
import { Component } from "vue-property-decorator"

import { mutationTypes } from "../store"

@Component
export default class BracketNameForm extends Vue {
  value = ""

  submit() {
    this.$store.commit(mutationTypes.SET_BRACKET_NAME, this.value)
  }
}
</script>
