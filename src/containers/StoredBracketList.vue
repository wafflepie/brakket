<template>
  <div>
    <ul>
      <li 
        v-for="(bracket, index) of brackets" 
        v-if="index < limit"
        :key="bracket.id">
        <span>
          <!-- The indentation is shitty because HTML is shitty. -->
          <router-link :to="{ name: 'bracket-detail', params: { id: bracket.id } }">
          {{ bracket.name || 'Unnamed bracket' }}</router-link>,
          {{ bracket.participants.length }} participant{{ bracket.participants.length > 1 ? 's' : '' }},
          last modified {{ distanceInWordsToNow(bracket.lastModified) }} ago
        </span>
        <RemoveButton :on-click="() => removeBracket(bracket.id)">X</RemoveButton>
      </li>
    </ul>
    <GhostButton 
      v-if="brackets.length > limit"
      :on-click="showMore">Show more</GhostButton>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import localforage from "localforage"
import { distanceInWordsToNow } from "date-fns"

import GhostButton from "../components/GhostButton.vue"
import RemoveButton from "../components/RemoveButton.vue"

const DEFAULT_BRACKET_LIMIT = 10

@Component({
  created() {
    this.loadBracketList()
  },
  components: { GhostButton, RemoveButton },
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

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $list-item-margin;
}
</style>
