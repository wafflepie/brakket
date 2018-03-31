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
import { Component, Vue, Watch } from "vue-property-decorator"

import BracketNameForm from "./BracketNameForm.view.vue"
import { mutationTypes, initialState } from "../store"

@Component({
  components: { BracketNameForm },
  created() {
    this.resetName()
  },
})
export default class Home extends Vue {
  get isParticipantsForm() {
    return (
      this.$route.name === "named-participants" ||
      this.$route.name === "numbered-participants"
    )
  }

  get isBracketNameSet() {
    return !!this.$store.state.bracket.name
  }

  @Watch("$route")
  resetName() {
    !this.isParticipantsForm &&
      this.$store.commit(
        mutationTypes.SET_BRACKET_NAME,
        initialState.bracket.name
      )
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
