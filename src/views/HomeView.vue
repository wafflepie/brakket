<template>
  <main>
    <router-view v-if="!isRouteParticipantsForm || isBracketNameSet" />
    <BracketNameForm v-else />
  </main>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import BracketNameForm from "../containers/BracketNameForm.vue"

@Component({ components: { BracketNameForm } })
export default class HomeView extends Vue {
  get isRouteParticipantsForm() {
    return /participants-form/.test(this.$route.name)
  }

  get isBracketNameSet() {
    return !!this.$store.state.bracket.name
  }
}
</script>


<style lang="scss" scoped>
main {
  margin: 0 auto $section-margin auto;
  max-width: $home-width;
  text-align: center;
}
</style>
