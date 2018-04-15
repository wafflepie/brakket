<template>
  <button
    class="remove-item-button"
    type="button"
    @click.prevent="onClick">⌫</button>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class RemoveItemButton extends Vue {
  @Prop(Function) onClick
}
</script>

<style lang="scss" scoped>
.remove-item-button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: inline-block;
  font-size: $form-element-font-size;
  padding: $input-padding $button-padding;
  position: relative;
  outline: none;

  &:hover,
  &:focus {
    color: $primary-color;
  }
}
</style>
