<template>
  <main>
    <transition name="slide">
      <section>
        <router-view v-if="!isParticipantsForm || isBracketNameSet" />
        <BracketNameForm v-else />
      </section>
    </transition>
  </main>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import BracketNameForm from "./BracketNameForm.view.vue"

@Component({ components: { BracketNameForm } })
export default class Home extends Vue {
  get isParticipantsForm() {
    return /participants-form/.test(this.$route.name)
  }

  get isBracketNameSet() {
    return !!this.$store.state.bracket.name
  }
}
</script>


<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}
</style>
