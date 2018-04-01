<template>
  <main>
    <router-view v-if="!isRouteParticipantsForm || isBracketNameSet" />
    <BracketNameForm v-else />
  </main>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import BracketNameForm from "./BracketNameForm.view.vue"

@Component({ components: { BracketNameForm } })
export default class Home extends Vue {
  get isRouteParticipantsForm() {
    return /participants-form/.test(this.$route.name)
  }

  get isBracketNameSet() {
    return !!this.$store.state.bracket.name
  }
}
</script>


<style scoped>
main {
  margin: 0 auto;
  max-width: 40rem;
  text-align: left;
}
</style>
