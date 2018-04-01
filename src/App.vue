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
  background: #111;
  margin: 0;
  padding: 0;
}

a {
  color: white;
  display: inline-block;
}

button {
  background: none;
  border: 1px solid #333;
  color: inherit;
  cursor: pointer;
  display: inline-block;
  font-size: 1.25rem;
  padding: 1rem;
  position: relative;
  outline: none;

  &:focus,
  &:hover {
    border: 1px solid white;
  }
}

form {
  display: inline-block;
  margin: 0 auto;
  margin-top: 2.5rem;
  text-align: left;
}

input {
  background: none;
  border: none;
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
  color: white;
  display: block;
  font-size: 1.2em;
  margin: 0 auto;
  outline: none;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  position: relative;
  width: 20rem;

  &::placeholder {
    color: #666;
  }

  &:not(:placeholder-shown),
  &:focus {
    border-color: white;
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
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.shifting {
  transition: transform 0.3s;

  &:hover {
    transform: translateX(0.5rem);
  }
}

.with-arrow::before {
  content: "↪ ";
}

.submit-button {
  float: right;
  margin-top: 3rem;
}

.remove-button {
  display: inline-block;
  font-size: 1.2em;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-left: 1rem;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: white;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 1.2rem;
  text-align: center;
  padding: 0 0.5rem;
}

// =================
// END GLOBAL STYLES
// =================
</style>

<style lang="scss" scoped>
#title {
  $font-size: 5rem;
  $margin: 5rem;

  font-size: $font-size;
  line-height: $font-size;
  margin-bottom: $margin / 2;
  margin-top: $margin;
  transition: all 0.5s ease-in-out;

  &.small {
    font-size: $font-size / 1.5;
    line-height: $font-size / 1.5;
    margin-bottom: $margin / 4;
    margin-top: $margin / 2;
  }

  a {
    text-decoration: none;
  }
}

.letter-k {
  display: inline-block;
  color: gold;
  transform: rotate(8deg);

  &:last-of-type {
    margin-right: -0.25rem;
  }
}
</style>
