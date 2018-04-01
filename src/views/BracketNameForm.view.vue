<template>
  <form>
    <label for="tournament-name">
      TOURNAMENT NAME
    </label>
    <input
      id="tournament-name"
      v-model="value"
      placeholder="Foosball Playoffs">
    <transition name="fade">
      <button 
        v-if="value.length"
        type="submit"
        @click.prevent="submit()">PROCEED</button>
    </transition>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import { mutationTypes } from "../store"

@Component
export default class BracketNameForm extends Vue {
  value = ""

  submit() {
    this.$store.commit(mutationTypes.SET_BRACKET_NAME, this.value)
  }
}
</script>

<style lang="scss" scoped>
form {
  display: inline-block;
  margin: 0 auto;
  margin-top: 2.5rem;
  text-align: left;
}

label {
  display: block;
  font-size: 0.9em;
  margin-bottom: 0.25rem;
}

input {
  $placeholder-color: #666;

  background: none;
  border-bottom: 1px solid $placeholder-color;
  border-right: 1px solid $placeholder-color;
  color: white;
  display: block;
  margin: 0 auto;
  outline: none;
  padding-bottom: 0.5rem;
  position: relative;
  width: 20rem;

  &::placeholder {
    color: $placeholder-color;
  }

  &:not(:placeholder-shown),
  &:focus {
    border-color: white;
  }
}

button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  float: right;
  font-size: 1.25rem;
  margin-top: 2.5rem;
  padding: 0;
  position: relative;
  outline: none;
  transition: transform 0.3s;

  &::before {
    content: "↪ ";
  }

  &:hover {
    transform: translateX(0.5rem);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
