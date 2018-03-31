<template>
  <form>
    <input 
      v-model="value" 
      type="number">
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
export default class NumberedParticipantsForm extends Vue {
  value = ""

  submit() {
    this.$store.dispatch(
      actionTypes.GENERATE_NEW_BRACKET,
      R.times(index => `Team ${index + 1}`, Number(this.value))
    )
  }
}
</script>
