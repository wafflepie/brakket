<template>
  <ul>
    <li v-for="bracket of brackets" :key="bracket.id">
      <!-- The indentation is shitty because HTML is shitty. -->
      <router-link :to="{ name: 'bracket', params: { id: bracket.id } }">
        {{ bracket.name || 'Unnamed bracket' }}</router-link>,
        last modified {{ distanceInWordsToNow(bracket.lastModified)}} ago
    </li>
  </ul>
</template>

<script>
import Vue from "vue"
import { Component } from "vue-property-decorator"
import localforage from "localforage"
import * as R from "ramda"
import { distanceInWordsToNow } from "date-fns"

@Component({
  created() {
    localforage
      .keys()
      .then(R.map(localforage.getItem.bind(localforage)))
      .then(keys => Promise.all(keys))
      .then(R.map(JSON.parse))
      .then(brackets => (this.brackets = brackets))
  },
})
export default class StoredBracketList extends Vue {
  brackets = []
  distanceInWordsToNow = distanceInWordsToNow
}
</script>

<style>
</style>
