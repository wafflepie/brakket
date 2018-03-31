<template>
  <main>
    <h1>Brakket</h1>
    <transition name="slide">
      <section v-if="isHomeRoot">
        <ul>
          <li>
            <router-link :to="{ name: 'named-participants' }">
              I want to enter the names of participants
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'numbered-participants' }">
              I don't need to enter their names, just keep them numbered
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'stored-brackets' }">
              Show me the brackets that I've created previously
            </router-link>
          </li>
        </ul>
      </section>
      <section v-if="!isHomeRoot" class="home-section">
        <router-view />
      </section>
    </transition>
  </main>
</template>

<script>
import Vue from "vue"
import { Component } from "vue-property-decorator"

@Component
export default class Home extends Vue {
  get isHomeRoot() {
    return this.$route.name === "home"
  }
}
</script>


<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}
</style>
