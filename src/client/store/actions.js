import localforage from "localforage"
import shortid from "shortid"
import * as R from "ramda"

import { mutationTypes } from "./mutations"
import router from "../router"
import {
  generateSeedFromIdentifiers,
  generateResultStructureFromSeed,
  ensureTournamentDomainValidity,
} from "../domain"
import { selectToken, selectTournamentIsLoaded } from "../selectors"
import { PERMISSIONS } from "../../common"

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
  UPDATE_ACCESS_NAME: "UPDATE_ACCESS_NAME",
  UPDATE_TOURNAMENT_SCORE: "UPDATE_TOURNAMENT_SCORE",
}

export const actions = {
  [actionTypes.CLOSE_CURRENT_TOURNAMENT]({ commit, state }) {
    state.$socket.emit("tournamentClosed")
    commit(mutationTypes.RESET_TOURNAMENT_STATE)
  },
  [actionTypes.ENSURE_TOURNAMENT_STATE_VALIDITY](context) {
    const { commit, dispatch, state } = context

    commit(
      mutationTypes.INITIALIZE_TOURNAMENT_STATE,
      R.evolve({ domain: ensureTournamentDomainValidity }, state.tournament)
    )

    // we only store the state locally, because this action is dispatched
    // whenever we are notified of a score change (local or remote)
    dispatch(actionTypes.STORE_TOURNAMENT_STATE_LOCALLY)
  },
  async [actionTypes.GENERATE_NEW_TOURNAMENT](store, participants) {
    const { commit, dispatch, state } = store
    const seed = generateSeedFromIdentifiers(Object.keys(participants))
    const results = generateResultStructureFromSeed(seed)

    const token = R.times(shortid.generate, 8).join("")

    const tournament = {
      domain: {
        name: state.tournament.domain.name,
        participants,
        results,
        seed,
      },
      meta: {
        created: +new Date(),
        lastModified: +new Date(),
      },
      accesses: {
        creator: {
          token,
          permissions: PERMISSIONS.CREATOR,
        },
      },
    }

    commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, tournament)
    await dispatch(actionTypes.STORE_TOURNAMENT_STATE_LOCALLY)

    // this relies on the fact that the TournamentBracketView dispatches
    // LOAD_TOURNAMENT_BY_TOKEN action, which emits 'tournamentOpened', the server
    // responds with 'tournamentDoesNotExist' and we respond with 'tournamentState'
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
      const lastModified = tournamentState.meta.lastModified
      commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, tournamentState)

      state.$socket.emit("tournamentOpened", token, lastModified)
    } else {
      state.$socket.emit("requestTournamentState", token)
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
  [actionTypes.SOCKET_RECONNECT]({ commit, state }) {
    const { $socket, tournament } = state
    const lastModified = tournament.meta.lastModified

    if (selectTournamentIsLoaded(state)) {
      $socket.emit("tournamentOpened", selectToken(state), lastModified)
    } else {
      state.$socket.emit("requestTournamentState", selectToken(state))
      commit(mutationTypes.SET_TOURNAMENT_LOADING, true)
    }
  },
  [actionTypes.SOCKET_REQUEST_TOURNAMENT_STATE]({ dispatch }) {
    dispatch(actionTypes.STORE_TOURNAMENT_STATE_REMOTELY)
  },
  [actionTypes.SOCKET_TOURNAMENT_DOES_NOT_EXIST]({ commit, dispatch, state }) {
    if (selectTournamentIsLoaded(state)) {
      dispatch(actionTypes.STORE_TOURNAMENT_STATE_REMOTELY)
    } else {
      commit(mutationTypes.SET_TOURNAMENT_LOADING, false)
    }
  },
  [actionTypes.SOCKET_TOURNAMENT_SCORE]({ commit, dispatch }, payload) {
    commit(mutationTypes.SET_TOURNAMENT_SCORE, payload)
    dispatch(actionTypes.ENSURE_TOURNAMENT_STATE_VALIDITY)
  },
  [actionTypes.SOCKET_TOURNAMENT_STATE]({ commit, dispatch, state }, payload) {
    commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, {
      ...state.tournament,
      ...payload,
    })

    dispatch(actionTypes.ENSURE_TOURNAMENT_STATE_VALIDITY)
  },
  async [actionTypes.STORE_TOURNAMENT_STATE_LOCALLY]({ state }) {
    const token = selectToken(state)

    if (token) {
      await localforage.setItem(
        token,
        JSON.stringify(R.omit(["transient"], state.tournament))
      )
    }
  },
  [actionTypes.STORE_TOURNAMENT_STATE_REMOTELY]({ state }) {
    if (selectTournamentIsLoaded(state)) {
      const { $socket, tournament } = state
      const token = selectToken(state)

      $socket.emit("tournamentState", token, R.omit(["transient"], tournament))
    }
  },
  [actionTypes.UPDATE_ACCESS_NAME]({ commit, state }, payload) {
    state.$socket.emit("accessName", {
      token: payload.access.token,
      value: payload.value,
    })

    commit(mutationTypes.SET_ACCESS_NAME, payload)
  },
  [actionTypes.UPDATE_TOURNAMENT_SCORE]({ commit, state }, payload) {
    state.$socket.emit("tournamentScore", payload)
    commit(mutationTypes.SET_TOURNAMENT_SCORE, payload)
  },
}
