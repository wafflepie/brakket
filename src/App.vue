<template>
  <div id="app">
    <h1>
      <router-link :to="{ name: 'home' }">
        Brakket
      </router-link>
    </h1>
    <router-view />
  </div>
</template>

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
