import localforage from "localforage"
import shortid from "shortid"

import { mutationTypes } from "./mutations"
import router from "../router"
import {
  generateSeedFromIdentifiers,
  generateResultStructureFromSeed,
  ensureTournamentStateValidity,
} from "../domain"

export const actionTypes = {
  ENSURE_TOURNAMENT_STATE_VALIDITY: "ENSURE_TOURNAMENT_STATE_VALIDITY",
  GENERATE_NEW_TOURNAMENT: "GENERATE_NEW_TOURNAMENT",
  LOAD_TOURNAMENT_BY_KEY: "LOAD_TOURNAMENT_BY_URL",
  SHUFFLE: "SHUFFLE",
  STORE_CURRENT_TOURNAMENT_STATE: "STORE_CURRENT_TOURNAMENT_STATE",
}

export const actions = {
  [actionTypes.ENSURE_TOURNAMENT_STATE_VALIDITY](context) {
    const { commit, dispatch, state } = context
    const { tournament } = state

    commit(
      mutationTypes.INITIALIZE_TOURNAMENT_STATE,
      ensureTournamentStateValidity(tournament)
    )

    dispatch(actionTypes.STORE_CURRENT_TOURNAMENT_STATE)
  },
  [actionTypes.GENERATE_NEW_TOURNAMENT](store, participants) {
    const { commit, dispatch, state } = store
    const seed = generateSeedFromIdentifiers(Object.keys(participants))
    const results = generateResultStructureFromSeed(seed)

    const id = shortid.generate()

    const tournament = {
      created: +new Date(),
      id,
      lastModified: +new Date(),
      name: state.tournament.name,
      participants,
      results,
      seed,
    }

    commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, tournament)
    dispatch(actionTypes.STORE_CURRENT_TOURNAMENT_STATE)
  },
  async [actionTypes.LOAD_TOURNAMENT_BY_KEY]({ commit }, key) {
    commit(mutationTypes.MERGE_LOADING, { tournament: true })
    const value = await localforage.getItem(key)
    const state = JSON.parse(value)
    commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, state)
  },
  [actionTypes.SHUFFLE]({ commit, dispatch, state }) {
    const seed = generateSeedFromIdentifiers(
      Object.keys(state.tournament.participants)
    )

    commit(mutationTypes.INITIALIZE_TOURNAMENT_STATE, {
      ...state.tournament,
      seed,
    })

    dispatch(actionTypes.STORE_CURRENT_TOURNAMENT_STATE)
  },
  async [actionTypes.STORE_CURRENT_TOURNAMENT_STATE]({ state }) {
    const newState = { ...state.tournament, lastModified: +new Date() }
    await localforage.setItem(state.tournament.id, JSON.stringify(newState))

    router.push({
      name: "tournament-bracket",
      params: { id: state.tournament.id },
    })
  },
}
