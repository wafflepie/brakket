<template>
  <div>
    <h1>Brackets</h1>
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

@Component
export default class Brackets extends Vue {
  get participants() {
    return this.$store.state.participants
  }
}
</script>
