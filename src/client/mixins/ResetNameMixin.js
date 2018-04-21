import { mutationTypes, initialState } from "../store"

export default {
  destroyed() {
    this.$store.commit(
      mutationTypes.SET_TOURNAMENT_NAME,
      initialState.tournament.domain.name
    )
  },
}
