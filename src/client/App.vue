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
  max-width: $input-width;
  text-align: left;
  width: 100%;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

input {
  background: none;
  border: none;
  border-bottom: 1px solid $border-inactive-color;
  border-right: 1px solid $border-inactive-color;
  color: $font-color;
  display: block;
  font-size: $form-element-font-size;
  margin: 0 auto;
  max-width: $input-width;
  outline: none;
  padding-bottom: $input-padding;
  padding-top: $input-padding;
  position: relative;
  width: 100%;

  &::placeholder {
    color: $input-placeholder-color;
  }

  &:not(:placeholder-shown) {
    border-color: $border-active-color;
  }

  &:focus {
    border-color: $primary-color;
  }

  &:disabled {
    border-color: $border-inactive-color;
    cursor: not-allowed;
  }

  &:read-only {
    border-color: transparent;
    cursor: pointer;
    font-weight: 500;
    text-overflow: ellipsis;
  }
}

label {
  display: block;
  font-size: $label-font-size;
  line-height: $label-line-height;
  margin-bottom: $label-bottom-margin;
}

.invisible {
  visibility: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-duration;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// Wrapped in body so it has priority over default styles
body {
  .v--modal {
    background-color: $background-color;
    border: 1px solid $tab-active-color;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
  }

  .v--modal-overlay {
    background-color: $share-modal-overlay-color;

    // HACK: vue-js-modal is weird on mobile
    position: fixed;

    top: -99999px;
    right: -99999px;
    left: -99999px;
    bottom: -99999px;

    padding-top: 99999px;
    height: auto;

    padding-left: 99999px;
    width: auto;
  }

  .tooltip {
    z-index: 2;

    &.client-tooltip {
      .tooltip-inner {
        background-color: $status-bar-color;
        border-bottom-left-radius: $tooltip-border-radius;
        border-bottom-right-radius: $tooltip-border-radius;
        font-size: $tooltip-font-size;
        pointer-events: none;
        padding: 0 $tooltip-padding;
      }
    }

    &.copied-tooltip {
      .tooltip-inner {
        background-color: $background-color;
        border: 1px solid $tab-active-color;
        color: $primary-color;
        padding: 0 $tooltip-padding;
        pointer-events: none;
      }
    }
  }
}
// =================
// END GLOBAL STYLES
// =================
</style>
