<template>
  <div id="app">
    <h1 
      id="title" 
      :class="{ small: isRouteBracket }">
      <router-link :to="{ name: 'home' }">
        bra<span class="letter-k">k</span><span class="letter-k">k</span>et
      </router-link>
    </h1>
    <router-view />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"

@Component
export default class App extends Vue {
  get isRouteBracket() {
    return this.$route.name === "bracket-detail"
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
  padding: 0 $body-padding;
  text-align: center;
}

a {
  color: $font-color;
  display: inline-block;
}

form {
  display: inline-block;
  margin: 0 auto;
  margin-top: $section-margin;
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

  &:not(:placeholder-shown),
  &:focus {
    border-color: $border-color-active;
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

<style lang="scss" scoped>
#title {
  font-size: $title-font-size;
  line-height: $title-font-size;
  margin-bottom: $section-margin;
  margin-top: $section-margin;
  transition: all 0.5s ease-in-out;

  &.small {
    font-size: $title-font-size / 1.5;
    line-height: $title-font-size / 1.5;
    margin-bottom: $section-margin / 2;
  }

  a {
    text-decoration: none;
  }
}

.letter-k {
  display: inline-block;
  color: $primary-color;
  transform: rotate(8deg);

  &:last-of-type {
    margin-right: -0.25rem;
  }
}
</style>
