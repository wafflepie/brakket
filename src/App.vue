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
export default class Home extends Vue {
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
  background: $background-color;
  margin: 0;
  padding: 0;
}

a {
  color: $font-color;
  display: inline-block;
}

button {
  background: none;
  border: 1px solid $border-color-inactive;
  color: inherit;
  cursor: pointer;
  display: inline-block;
  font-size: $form-element-font-size;
  padding: $button-padding;
  position: relative;
  outline: none;

  &:focus,
  &:hover {
    border: 1px solid $border-color-active;
  }
}

form {
  display: inline-block;
  margin: 0 auto;
  margin-top: $section-margin;
  text-align: left;
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

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-duration;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.shifting {
  transition: transform $transition-duration;

  &:hover {
    transform: translateX(0.5rem);
  }
}

.with-arrow::before {
  content: "↪ ";
}

.submit-button {
  float: right;
  margin-top: $section-margin;
}

.remove-button {
  display: inline-block;
  font-size: $form-element-font-size;
  padding-top: $input-padding;
  padding-bottom: $input-padding;
  margin-left: 1rem;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: $font-color;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: $font-size;
  text-align: center;
  padding: 0 0.5rem;
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
