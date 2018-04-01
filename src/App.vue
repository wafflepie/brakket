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
}

input {
  border: none;
  font-size: 1.2em;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

// =================
// END GLOBAL STYLES
// =================
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: white;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 1.2rem;
  text-align: center;
  padding: 0 0.5rem;
}

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
