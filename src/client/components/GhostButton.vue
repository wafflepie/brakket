<template>
  <button
    class="ghost-button"
    type="button"
    @click.prevent="onClick"><slot /></button>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class GhostButton extends Vue {
  @Prop(Function) onClick
}
</script>

<style lang="scss" scoped>
.ghost-button {
  background: none;
  border: 1px solid $border-active-color;
  color: inherit;
  cursor: pointer;
  display: inline-block;
  font-size: $form-element-font-size;
  padding: $button-padding;
  position: relative;
  outline: none;

  &:focus,
  &:hover {
    border-color: $primary-color;
    color: $primary-color;
  }

  &:disabled {
    border-color: $disabled-color;
    color: $disabled-color;
    cursor: not-allowed;
  }
}
</style>
