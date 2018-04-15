import Vue from "vue"
import Vuex from "vuex"
import localforage from "localforage"
import shortid from "shortid"
import * as R from "ramda"

import {
  generateSeedFromIdentifiers,
  generateResultStructureFromSeed,
  ensureTournamentStateValidity,
} from "./domain"

import router from "./router"

Vue.use(Vuex)

export const mutationTypes = {
  CHANGE_SIDE_SCORE: "CHANGE_SIDE_SCORE",
  INITIALIZE_TOURNAMENT_STATE: "INITIALIZE_TOURNAMENT_STATE",
  SET_LOADING: "SET_LOADING",
  SET_TOURNAMENT_NAME: "SET_TOURNAMENT_NAME",
}

export const actionTypes = {
  ENSURE_TOURNAMENT_STATE_VALIDITY: "ENSURE_TOURNAMENT_STATE_VALIDITY",
  GENERATE_NEW_TOURNAMENT: "GENERATE_NEW_TOURNAMENT",
  LOAD_TOURNAMENT_BY_KEY: "LOAD_TOURNAMENT_BY_URL",
  SHUFFLE: "SHUFFLE",
  STORE_CURRENT_TOURNAMENT_STATE: "STORE_CURRENT_TOURNAMENT_STATE",
}

// type Participants = Array<string>
// type Seed = Array<{ home: number, away: number }>
// type Side = { score: ?number }

// type Match = {
//   home: Side,
//   away: Side,
//   roundIndex: number,
//   matchIndex: number
// }

// type Round = Array<Match>
// type Results = Array<Round>

// type ExtendedSide = Side & { name: ?string }

// type ExtendedMatch = {
//   home: ExtendedSide,
//   away: ExtendedSide,
//   roundIndex: number,
//   matchIndex: number,
//   winner: 'home' | 'away'
// }

export const initialState = {
  loading: false,
  tournament: {
    created: null,
    id: null,
    lastModified: null,
    name: null,
    participants: [], // Participants
    seed: [], // Seed
    results: [], // Results
  },
}

export default new Vuex.Store({
  state: R.clone(initialState),
  mutations: {
    [mutationTypes.CHANGE_SIDE_SCORE](state, payload) {
      const { roundIndex, matchIndex, side, score } = payload

      state.tournament.results[roundIndex][matchIndex][side].score =
        parseInt(score) || 0
    },
    [mutationTypes.INITIALIZE_TOURNAMENT_STATE](state, payload) {
      state.loading = false
      state.tournament = R.clone(payload || initialState.tournament)
    },
    [mutationTypes.SET_LOADING](state, payload) {
      state.loading = payload
    },
    [mutationTypes.SET_TOURNAMENT_NAME](state, payload) {
      state.tournament.name = payload
    },
  },
  actions: {
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
      commit(mutationTypes.SET_LOADING, true)
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
  },
})
