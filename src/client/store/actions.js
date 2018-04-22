import localforage from "localforage"
import shortid from "shortid"
import * as R from "ramda"

import { mutationTypes } from "./mutations"
import initialState from "./model"
import router from "../router"
import {
  generateSeedFromIdentifiers,
  generateResultStructureFromSeed,
  ensureTournamentDomainValidity,
} from "../domain"

export const actionTypes = {
  CLOSE_CURRENT_TOURNAMENT: "CLOSE_CURRENT_TOURNAMENT",
  ENSURE_TOURNAMENT_STATE_VALIDITY: "ENSURE_TOURNAMENT_STATE_VALIDITY",
  GENERATE_NEW_TOURNAMENT: "GENERATE_NEW_TOURNAMENT",
  LOAD_TOURNAMENT_BY_TOKEN: "LOAD_TOURNAMENT_BY_TOKEN",
  SHUFFLE: "SHUFFLE",
  SOCKET_RECONNECT: "socket_reconnect",
  SOCKET_REQUEST_TOURNAMENT_STATE: "socket_requestTournamentState",
  SOCKET_TOURNAMENT_DOES_NOT_EXIST: "socket_tournamentDoesNotExist",
  SOCKET_TOURNAMENT_SCORE: "socket_tournamentScore",
  SOCKET_TOURNAMENT_STATE: "socket_tournamentState",
  STORE_TOURNAMENT_STATE_LOCALLY: "STORE_TOURNAMENT_STATE_LOCALLY",
  STORE_TOURNAMENT_STATE_REMOTELY: "STORE_TOURNAMENT_STATE_REMOTELY",
  UPDATE_TOURNAMENT_SCORE: "UPDATE_TOURNAMENT_SCORE",
}

export const actions = {
  [actionTypes.CLOSE_CURRENT_TOURNAMENT]({ state }) {
    state.$socket.emit("tournamentClosed", state.tournament.token)
  },
  [actionTypes.ENSURE_TOURNAMENT_STATE_VALIDITY](context) {
    const { commit, dispatch, state } = context

    commit(
      mutationTypes.INITIALIZE_TOURNAMENT_STATE,
      R.evolve({ domain: ensureTournamentDomainValidity }, state.tournament)
    )

    dispatch(actionTypes.STORE_TOURNAMENT_STATE_LOCALLY)
  },
  async [actionTypes.GENERATE_NEW_TOURNAMENT](store, participants) {
    const { commit, dispatch, state } = store
    const seed = generateSeedFromIdentifiers(Object.keys(participants))
    const results = generateResultStructureFromSeed(seed)

    const token = shortid.generate()

    const tournament = {
      domain: {
        name: state.tournament.domain.name,
        participants,
        results,
        seed,
      },
      local: {
        created: +new Date(),
        lastModified: +new Date(),
      },
      token,
    }

    commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, tournament)
    await dispatch(actionTypes.STORE_TOURNAMENT_STATE_LOCALLY)

    // this relies on the fact that the TournamentBracketView dispatches
    // LOAD_TOURNAMENT_BY_TOKEN action, which emits 'tournamentOpened', the server
    // responds with 'tournamentDoesNotExist' and we respond with 'doCreateTournament'
    router.push({
      name: "tournament-bracket",
      params: { token },
    })
  },
  async [actionTypes.LOAD_TOURNAMENT_BY_TOKEN]({ commit, state }, token) {
    commit(mutationTypes.SET_TOURNAMENT_LOADING, true)
    const value = await localforage.getItem(token)

    if (value) {
      const tournamentState = JSON.parse(value)
      commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, tournamentState)

      state.$socket.emit(
        "tournamentOpened",
        token,
        tournamentState.local.lastModified
      )
    } else if (state.online) {
      state.$socket.emit("tournamentOpened", token)
      state.$socket.emit("requestTournamentState", token)
      commit(mutationTypes.SET_TOURNAMENT_LOADING, true)
    } else {
      commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, initialState.tournament)
    }
  },
  [actionTypes.SHUFFLE]({ commit, dispatch, state }) {
    const seed = generateSeedFromIdentifiers(
      Object.keys(state.tournament.domain.participants)
    )

    commit(
      mutationTypes.INITIALIZE_TOURNAMENT_STATE,
      R.assocPath(["domain", "seed"], seed, state.tournament)
    )

    dispatch(actionTypes.STORE_TOURNAMENT_STATE_LOCALLY)
    dispatch(actionTypes.STORE_TOURNAMENT_STATE_REMOTELY)
  },
  [actionTypes.SOCKET_RECONNECT]({ state }) {
    const { $socket, tournament } = state

    if (tournament.local.created) {
      $socket.emit(
        "tournamentOpened",
        tournament.token,
        tournament.local.lastModified
      )
    }
  },
  [actionTypes.SOCKET_REQUEST_TOURNAMENT_STATE]({ dispatch }) {
    dispatch(actionTypes.STORE_TOURNAMENT_STATE_REMOTELY)
  },
  [actionTypes.SOCKET_TOURNAMENT_DOES_NOT_EXIST]({ commit, state }) {
    const { $socket, tournament } = state

    if (tournament.local.created) {
      $socket.emit("doCreateTournament", tournament.token, tournament.domain)
    } else {
      commit(mutationTypes.SET_TOURNAMENT_LOADING, false)
    }
  },
  [actionTypes.SOCKET_TOURNAMENT_SCORE]({ commit, dispatch }, payload) {
    commit(mutationTypes.SET_TOURNAMENT_SCORE, payload)
    dispatch(actionTypes.ENSURE_TOURNAMENT_STATE_VALIDITY)
  },
  [actionTypes.SOCKET_TOURNAMENT_STATE]({ commit }, payload) {
    const { domain, ...remote } = payload

    commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, {
      domain,
      local: remote,
      remote,
      token: router.currentRoute.params.token,
    })
  },
  async [actionTypes.STORE_TOURNAMENT_STATE_LOCALLY]({ state }) {
    const { tournament } = state

    await localforage.setItem(
      tournament.token,
      JSON.stringify(R.omit(["transient", "remote"], tournament))
    )
  },
  [actionTypes.STORE_TOURNAMENT_STATE_REMOTELY]({ state }) {
    const { $socket, tournament } = state
    const { token } = tournament

    // we keep the structure consistent across the app, although BE only needs the domain
    $socket.emit("tournamentState", token, R.pick(["domain"], tournament))
  },
  [actionTypes.UPDATE_TOURNAMENT_SCORE]({ commit, state }, payload) {
    state.$socket.emit("tournamentScore", state.tournament.token, payload)
    commit(mutationTypes.SET_TOURNAMENT_SCORE, payload)
    // we do not want to store the score here, because it might not be valid
    // we wait until the ENSURE_TOURNAMENT_STATE_VALIDITY action
  },
}
