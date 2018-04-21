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
  ENSURE_TOURNAMENT_STATE_VALIDITY: "ENSURE_TOURNAMENT_STATE_VALIDITY",
  GENERATE_NEW_TOURNAMENT: "GENERATE_NEW_TOURNAMENT",
  LOAD_TOURNAMENT_BY_TOKEN: "LOAD_TOURNAMENT_BY_TOKEN",
  SHUFFLE: "SHUFFLE",
  SOCKET_TOURNAMENT_DOES_NOT_EXIST: "socket_tournamentDoesNotExist",
  STORE_CURRENT_TOURNAMENT_STATE: "STORE_CURRENT_TOURNAMENT_STATE",
}

export const actions = {
  [actionTypes.ENSURE_TOURNAMENT_STATE_VALIDITY](context) {
    const { commit, dispatch, state } = context

    commit(
      mutationTypes.INITIALIZE_TOURNAMENT_STATE,
      R.evolve({ domain: ensureTournamentDomainValidity }, state.tournament)
    )

    dispatch(actionTypes.STORE_CURRENT_TOURNAMENT_STATE)
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
    state.$socket.emit("tournamentCreated", token, tournament.domain)
    await dispatch(actionTypes.STORE_CURRENT_TOURNAMENT_STATE)

    router.push({
      name: "tournament-bracket",
      params: { token },
    })
  },
  async [actionTypes.LOAD_TOURNAMENT_BY_TOKEN]({ commit, state }, token) {
    commit(mutationTypes.SET_TOURNAMENT_LOADING, true)
    const value = await localforage.getItem(token)

    if (!value) {
      return commit(
        mutationTypes.INITIALIZE_TOURNAMENT_STATE,
        initialState.tournament
      )
    }

    const tournamentState = JSON.parse(value)
    commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, tournamentState)
    state.$socket.emit("tournamentLoaded", tournamentState.token)
  },
  [actionTypes.SHUFFLE]({ commit, dispatch, state }) {
    const seed = generateSeedFromIdentifiers(
      Object.keys(state.tournament.domain.participants)
    )

    commit(
      mutationTypes.INITIALIZE_TOURNAMENT_STATE,
      R.assocPath(["domain", "seed"], seed, state.tournament)
    )

    dispatch(actionTypes.STORE_CURRENT_TOURNAMENT_STATE)
  },
  [actionTypes.SOCKET_TOURNAMENT_DOES_NOT_EXIST]({ state }) {
    state.$socket.emit(
      "tournamentCreated",
      state.tournament.token,
      state.tournament.domain
    )
  },
  async [actionTypes.STORE_CURRENT_TOURNAMENT_STATE]({ state }) {
    await localforage.setItem(
      state.tournament.token,
      JSON.stringify(R.omit(["transient", "remote"], state.tournament))
    )
  },
}
