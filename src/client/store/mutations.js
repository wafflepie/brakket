import * as R from "ramda"

import initialState from "./model"

export const mutationTypes = {
  INITIALIZE_TOURNAMENT_STATE: "INITIALIZE_TOURNAMENT_STATE",
  RESET_TOURNAMENT_STATE: "RESET_TOURNAMENT_STATE",
  SET_SOCKET: "SET_SOCKET",
  SET_TOURNAMENT_LOADING: "SET_TOURNAMENT_LOADING",
  SET_TOURNAMENT_NAME: "SET_TOURNAMENT_NAME",
  SET_TOURNAMENT_SCORE: "SET_TOURNAMENT_SCORE",
  SOCKET_CLIENTS: "SOCKET_CLIENTS",
  SOCKET_CONNECT: "SOCKET_CONNECT",
  SOCKET_DISCONNECT: "SOCKET_DISCONNECT",
}

export const mutations = {
  [mutationTypes.INITIALIZE_TOURNAMENT_STATE](state, payload) {
    state.tournament = R.mergeDeepRight(initialState.tournament, payload)
    state.tournament.transient.loading = false
  },
  [mutationTypes.RESET_TOURNAMENT_STATE](state) {
    state.tournament = R.clone(initialState.tournament)
  },
  [mutationTypes.SET_SOCKET](state, payload) {
    state.$socket = payload
  },
  [mutationTypes.SET_TOURNAMENT_LOADING](state, payload) {
    state.tournament.transient.loading = payload
  },
  [mutationTypes.SET_TOURNAMENT_NAME](state, payload) {
    state.tournament.domain.name = payload
  },
  [mutationTypes.SET_TOURNAMENT_SCORE](state, payload) {
    const { roundIndex, matchIndex, side, score } = payload

    state.tournament.meta.lastModified = +new Date()
    state.tournament.domain.results[roundIndex][matchIndex][side].score =
      parseInt(score) || 0
  },
  [mutationTypes.SOCKET_CLIENTS](state, payload) {
    state.tournament.transient.clients = payload
  },
  [mutationTypes.SOCKET_CONNECT](state) {
    state.online = true
  },
  [mutationTypes.SOCKET_DISCONNECT](state) {
    state.online = false
  },
}
