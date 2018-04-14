<template>
  <div id="app">
    <BrakketTitle :class="{ small: isRouteTournamentBracket }" />
    <router-view />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

import BrakketTitle from "./components/BrakketTitle.vue"

@Component({ components: { BrakketTitle } })
export default class App extends Vue {
  get isRouteTournamentBracket() {
    return this.$route.name === "tournament-bracket"
  }
}
</script>


<style lang="scss">
// ===================
// BEGIN GLOBAL STYLES
// ===================

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: $background-color;
  color: $font-color;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: $font-size;
  margin: 0;
  padding: 0 $body-padding $section-margin $body-padding;
  text-align: center;
}

a {
  color: $font-color;
  display: inline-block;

  &:hover {
    color: $primary-color;
  }
}

form {
  display: inline-block;
  margin: 0 auto;
  text-align: left;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

input {
  background: none;
  border: none;
  border-bottom: 1px solid $border-color-inactive;
  border-right: 1px solid $border-color-inactive;
  color: $font-color;
  display: block;
  font-size: $form-element-font-size;
  margin: 0 auto;
  outline: none;
  padding-bottom: $input-padding;
  padding-top: $input-padding;
  position: relative;
  width: $input-width;

  &::placeholder {
    color: $input-placeholder-color;
  }

  &:not(:placeholder-shown) {
    border-color: $border-color-active;
  }

  &:focus {
    border-color: $primary-color;
  }
}

label {
  display: block;
  font-size: 0.9em;
  margin-bottom: 0.25rem;
}

// =================
// END GLOBAL STYLES
// =================
</style>
