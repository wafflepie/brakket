<template>
<nav>
  <ul>
    <li id="brand">
      <router-link to="/">
        Brakket
      </router-link>
    </li>
    <li v-if="isBracketShown" tabindex="0">
      <button @click="shuffle">
        Shuffle
      </button>
    </li>
  </ul>
</nav>
</template>

<script>
import Vue from "vue"
import Component from "vue-class-component"

import { actionTypes } from "../store"

@Component
export default class Navigation extends Vue {
  get isBracketShown() {
    return this.$route.name === "bracket"
  }

  shuffle() {
    this.$store.dispatch(actionTypes.SHUFFLE)
  }
}
</script>

<style scoped>
nav {
  padding: 0.5rem;
}

nav ul {
  list-style-type: none;
  display: flex;
  margin-top: 0;
  margin-bottom: 0;
  text-align: left;
}

nav ul li {
  flex-grow: 0;
}

nav ul li a {
  color: initial;
  text-decoration: none;
}
</style>
