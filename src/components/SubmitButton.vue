<template>
  <GhostButton
    :on-click="onClick"
    class="submit-button"
    type="submit"><slot /></GhostButton>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator"

import GhostButton from "./GhostButton.vue"

@Component({ components: { GhostButton } })
export default class SubmitButton extends Vue {
  @Prop(Function) onClick
}
</script>

<style lang="scss" scoped>
.ghost-button.submit-button {
  float: right;
  margin-top: $section-margin;
  background-color: $button-background-color;
}
</style>
