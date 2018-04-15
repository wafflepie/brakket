<template>
  <section>
    <ul>
      <li 
        v-for="(tournament, index) of tournaments" 
        v-if="index < limit"
        :key="tournament.id">
        <span class="tournament-text">
          <!-- The indentation is shitty because HTML is shitty. -->
          <router-link :to="{ name: 'tournament-bracket', params: { id: tournament.id } }">
            {{ tournament.name || 'Unnamed tournament' }}
          </router-link>
          <span class="tournament-description">
            {{ tournament.participants.length }} participant{{ tournament.participants.length > 1 ? 's' : '' }},
            last modified {{ distanceInWordsToNow(tournament.lastModified) }} ago
          </span>
        </span>
        <RemoveItemButton :on-click="() => removeTournament(tournament.id)">X</RemoveItemButton>
      </li>
    </ul>
    <GhostButton 
      :class="{ invisible: tournaments.length <= limit }"
      :on-click="showMore">SHOW MORE</GhostButton>
  </section>
</template>

<script>
import { Component, Vue } from "vue-property-decorator"
import localforage from "localforage"
import { distanceInWordsToNow } from "date-fns"
import * as R from "ramda"

import { DEFAULT_TOURNAMENT_LIST_SIZE_LIMIT } from "../constants"
import GhostButton from "../components/GhostButton.vue"
import RemoveItemButton from "../components/RemoveItemButton.vue"

@Component({
  created() {
    this.loadTournamentList()
  },
  components: { GhostButton, RemoveItemButton },
})
export default class StoredTournamentList extends Vue {
  tournaments = []
  distanceInWordsToNow = distanceInWordsToNow
  limit = DEFAULT_TOURNAMENT_LIST_SIZE_LIMIT

  async loadTournamentList() {
    const keys = await localforage.keys()
    const values = await Promise.all(keys.map(key => localforage.getItem(key)))
    const tournaments = values.map(JSON.parse)
    const comparator = R.comparator((a, b) => a.lastModified > b.lastModified)

    this.tournaments = R.sort(comparator, tournaments)
  }

  showMore() {
    this.limit += DEFAULT_TOURNAMENT_LIST_SIZE_LIMIT
  }

  async removeTournament(id) {
    await localforage.removeItem(id)
    await this.loadTournamentList()
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin-top: $section-margin;
  text-align: left;
}

ul + button {
  margin-top: $section-margin;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $list-item-margin * 2;

  a {
    display: block;
    font-size: $form-element-font-size;
  }
}

.invisible {
  visibility: hidden;
}
</style>
