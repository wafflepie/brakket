<template>
    <div>
    <ul>
      <li v-for="(bracket, index) of brackets" :key="bracket.id" v-if="index < limit">
        <!-- The indentation is shitty because HTML is shitty. -->
        <router-link :to="{ name: 'bracket', params: { id: bracket.id } }">
          {{ bracket.name || 'Unnamed bracket' }}</router-link>,
          last modified {{ distanceInWordsToNow(bracket.lastModified)}} ago
        <button @click="removeBracket(bracket.id)">X</button>
      </li>
    </ul>
    <button @click="showMore()" type="button" v-if="brackets.length > limit">Show more</button>
  </div>
</template>

<script>
import Vue from "vue"
import { Component } from "vue-property-decorator"
import localforage from "localforage"
import * as R from "ramda"
import { distanceInWordsToNow } from "date-fns"

const DEFAULT_BRACKET_LIMIT = 10

@Component({
  created() {
    this.loadBracketList()
  },
})
export default class StoredBracketList extends Vue {
  brackets = []
  distanceInWordsToNow = distanceInWordsToNow
  limit = DEFAULT_BRACKET_LIMIT

  loadBracketList() {
    localforage
      .keys()
      .then(R.map(localforage.getItem.bind(localforage)))
      .then(keys => Promise.all(keys))
      .then(R.map(JSON.parse))
      .then(brackets => (this.brackets = brackets))
  }

  showMore() {
    this.limit += DEFAULT_BRACKET_LIMIT
  }

  removeBracket(id) {
    localforage.removeItem(id).then(this.loadBracketList.bind(this))
  }
}
</script>

<style>
</style>
