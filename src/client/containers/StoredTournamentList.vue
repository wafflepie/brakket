<template>
  <section>
    <ul v-if="tournaments.length">
      <li 
        v-for="(tournament, index) of tournaments" 
        v-if="index < limit"
        :key="getToken(tournament)">
        <span class="tournament-text">
          <!-- The indentation is shitty because HTML is shitty. -->
          <router-link :to="{ name: 'tournament-bracket', params: { token: getToken(tournament) } }">
            {{ tournament.domain.name || 'Unnamed tournament' }}
          </router-link>
          {{ getCapitalizedPermissions(tournament) }}
          <span class="tournament-description">
            {{ getNumberOfParticipants(tournament) }},
            last modified {{ distanceInWordsToNow(tournament.meta.lastModified) }} ago
          </span>
        </span>
        <RemoveItemButton :on-click="() => removeTournament(getToken(tournament))">X</RemoveItemButton>
      </li>
    </ul>
    <h3 v-if="!tournaments.length">
      You haven't visited any tournaments yet.
    </h3>
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

import { selectAccessFromTournamentState, selectTokenFromTournamentState } from "../selectors"
import { DEFAULT_TOURNAMENT_LIST_SIZE_LIMIT, PERMISSIONS } from "../../common"
import { loadLocalTournaments } from "../utils"
import GhostButton from "../components/GhostButton.vue"
import RemoveItemButton from "../components/RemoveItemButton.vue"

@Component({
  created() {
    this.loadTournamentList()
  },
  components: { GhostButton, RemoveItemButton },
})
export default class StoredTournamentList extends Vue {
  distanceInWordsToNow = distanceInWordsToNow
  limit = DEFAULT_TOURNAMENT_LIST_SIZE_LIMIT
  tournaments = []

  getCapitalizedPermissions(tournament) {
    const access = selectAccessFromTournamentState(tournament)
    return `with ${access.permissions.toLowerCase()} permissions`
  }

  getNumberOfParticipants(tournament) {
    return `${tournament.domain.participants.length}  participant${
      tournament.domain.participants.length > 1 ? "s" : ""
    }`
  }

  getPermissionIndex(access) {
    return Object.values(PERMISSIONS).indexOf(access.permissions)
  }

  getToken(tournament) {
    return selectTokenFromTournamentState(tournament)
  }

  async loadTournamentList() {
    const tournaments = await loadLocalTournaments()

    const comparators = [
      R.descend(R.path(["meta", "lastModified"])),
      // we sort the tournaments by permissions as well because unique preserves the first one
      R.ascend(R.o(this.getPermissionIndex, selectAccessFromTournamentState)),
    ]

    this.tournaments = R.compose(
      R.uniqWith(R.eqBy(state => selectAccessFromTournamentState(state).tournament)),
      R.sortWith(comparators),
      R.values
    )(tournaments)
  }

  async removeTournament(token) {
    const tournaments = await loadLocalTournaments()
    const tournament = tournaments[token]

    const filteredTournaments = R.o(
      tournament.id ? R.reject(R.propEq("id", tournament.id)) : R.identity,
      R.omit([token])
    )(tournaments)

    await localforage.setItem("tournaments", filteredTournaments)
    await this.loadTournamentList()
  }

  showMore() {
    this.limit += DEFAULT_TOURNAMENT_LIST_SIZE_LIMIT
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
    font-size: $form-element-font-size;
  }

  .tournament-description {
    display: block;
  }
}

.invisible {
  visibility: hidden;
}
</style>
