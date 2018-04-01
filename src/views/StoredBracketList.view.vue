<template>
  <div>
    <ul>
      <li 
        v-for="(bracket, index) of brackets" 
        v-if="index < limit"
        :key="bracket.id">
        <!-- The indentation is shitty because HTML is shitty. -->
        <router-link :to="{ name: 'bracket-detail', params: { id: bracket.id } }">
        {{ bracket.name || 'Unnamed bracket' }}</router-link>,
        {{ bracket.participants.length }} participant{{ bracket.participants.length > 1 ? 's' : '' }},
        last modified {{ distanceInWordsToNow(bracket.lastModified) }} ago
        <button
          class="remove-button"
          @click="removeBracket(bracket.id)">X</button>
      </li>
    </ul>
    <button 
      v-if="brackets.length > limit"
      type="button" 
      @click="showMore()">Show more</button>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import localforage from "localforage"
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

  async loadBracketList() {
    const keys = await localforage.keys()
    const values = await Promise.all(keys.map(key => localforage.getItem(key)))
    const brackets = values.map(JSON.parse)

    this.brackets = brackets
  }

  showMore() {
    this.limit += DEFAULT_BRACKET_LIMIT
  }

  async removeBracket(id) {
    await localforage.removeItem(id)
    this.loadBracketList()
  }
}
</script>

<style lang="scss">
ul {
  text-align: left;
}

button {
  float: right;
}
</style>
