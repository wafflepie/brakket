import { mutationTypes, initialState } from "../store"

export default {
  destroyed() {
    this.$store.commit(
      mutationTypes.SET_BRACKET_NAME,
      initialState.bracket.name
    )
  },
}
