import * as R from "ramda"

import initialState from "./model"

export const mutationTypes = {
  INITIALIZE_TOURNAMENT_STATE: "INITIALIZE_TOURNAMENT_STATE",
  MERGE_LOADING: "MERGE_LOADING",
  SET_SOCKET: "SET_SOCKET",
  SET_TOURNAMENT_NAME: "SET_TOURNAMENT_NAME",
  SET_TOURNAMENT_SIDE_SCORE: "SET_TOURNAMENT_SIDE_SCORE",
  SOCKET_CONNECT: "SOCKET_CONNECT",
  SOCKET_DISCONNECT: "SOCKET_DISCONNECT",
}

export const mutations = {
  [mutationTypes.INITIALIZE_TOURNAMENT_STATE](state, payload) {
    state.loading.tournament = false
    state.tournament = R.clone(payload || initialState.tournament)
  },
  [mutationTypes.MERGE_LOADING](state, payload) {
    state.loading = R.mergeDeepRight(state.loading, payload)
  },
  [mutationTypes.SET_SOCKET](state, payload) {
    state.$socket = payload
  },
  [mutationTypes.SET_TOURNAMENT_NAME](state, payload) {
    state.tournament.name = payload
  },
  [mutationTypes.SET_TOURNAMENT_SIDE_SCORE](state, payload) {
    const { roundIndex, matchIndex, side, score } = payload

    state.tournament.results[roundIndex][matchIndex][side].score =
      parseInt(score) || 0
  },
  [mutationTypes.SOCKET_CONNECT](state) {
    state.online = true
  },
  [mutationTypes.SOCKET_DISCONNECT](state) {
    state.online = false
  },
}
