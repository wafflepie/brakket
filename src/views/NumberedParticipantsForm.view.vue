<template>
  <div>
    <BracketNameForm v-if="!isBracketNameSet" />
    <form v-if="isBracketNameSet">
      <input v-model="value" type="number" />
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
export default class NumberedParticipantsForm extends Vue {
  value = ""

  get isBracketNameSet() {
    return !!this.$store.state.bracket.name
  }

  submit() {
    this.$store.dispatch(
      actionTypes.GENERATE_NEW_BRACKET,
      R.times(index => `Team ${index + 1}`, Number(this.value))
    )
  }
}
</script>
