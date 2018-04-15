<template>
  <GhostButton
    :on-click="onClick"
    class="remove-button">⌫</GhostButton>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator"

import GhostButton from "./GhostButton.vue"

@Component({ components: { GhostButton } })
export default class RemoveButton extends Vue {
  @Prop(Function) onClick
}
</script>

<style lang="scss" scoped>
.ghost-button.remove-button {
  border-color: transparent;
  display: inline-block;
  font-size: $form-element-font-size;
  padding-top: $input-padding;
  padding-bottom: $input-padding;

  &:hover,
  &:focus {
    border-color: transparent;
    color: $primary-color;
  }
}
</style>
