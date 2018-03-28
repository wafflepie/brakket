<template>
  <div id="app">
    <navigation />
    <router-view />
  </div>
</template>

<script>
import Navigation from "./components/Navigation.component.vue"

export default {
  components: { navigation: Navigation },
}
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}

body {
  background-color: #fcfcfc;
  margin: 0;
  padding: 0;
}
</style>
