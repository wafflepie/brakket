<template>
  <div>
    <h1>Bracket</h1>
    <div v-for="participant of participants" :key="participant.id">
      {{ participant.name }}
    </div>
    <div v-if="!participants.length">
      You did not enter any names.
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import Component from "vue-class-component"
import * as R from "ramda"

import { actionTypes } from "../store"
import { assocParticipantNamesToMatchSides } from "../utils"

@Component({
  created() {
    this.$store.dispatch(actionTypes.LOAD_BRACKET_BY_KEY, this.$route.params.id)
  },
})
export default class Bracket extends Vue {
  get matches() {
    const results = this.$store.state.results

    return R.map(
      R.map(assocParticipantNamesToMatchSides(this.$store.state)),
      results
    )
  }

  get participants() {
    return this.$store.state.participants
  }
}
</script>
