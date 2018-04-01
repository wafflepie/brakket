import Vue from "vue"
import Vuex from "vuex"
import localforage from "localforage"
import shortid from "shortid"
import * as R from "ramda"

import {
  generateSeedFromIdentifiers,
  generateResultStructureFromSeed,
  validateResults,
} from "./utils"

import router from "./router"

Vue.use(Vuex)

export const mutationTypes = {
  CHANGE_SIDE_SCORE: "CHANGE_SIDE_SCORE",
  INITIALIZE_BRACKET_STATE: "INITIALIZE_BRACKET_STATE",
  SET_BRACKET_NAME: "SET_BRACKET_NAME",
}

export const actionTypes = {
  GENERATE_NEW_BRACKET: "GENERATE_NEW_BRACKET",
  LOAD_BRACKET_BY_KEY: "LOAD_BRACKET_BY_URL",
  SHUFFLE: "SHUFFLE",
  STORE_CURRENT_STATE: "STORE_CURRENT_STATE",
  VALIDATE_RESULTS: "VALIDATE_RESULTS",
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
  bracket: {
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

      state.bracket.results[roundIndex][matchIndex][side].score =
        parseInt(score) || 0
    },
    [mutationTypes.INITIALIZE_BRACKET_STATE](state, payload) {
      state.bracket = payload || R.clone(initialState.bracket)
    },
    [mutationTypes.SET_BRACKET_NAME](state, payload) {
      state.bracket.name = payload
    },
  },
  actions: {
    [actionTypes.GENERATE_NEW_BRACKET]({ commit, dispatch }, participants) {
      const seed = generateSeedFromIdentifiers(Object.keys(participants))
      const results = generateResultStructureFromSeed(seed)

      const id = shortid.generate()

      const state = {
        created: +new Date(),
        id,
        lastModified: +new Date(),
        participants,
        results,
        seed,
      }

      commit(mutationTypes.INITIALIZE_BRACKET_STATE, state)
      dispatch(actionTypes.STORE_CURRENT_STATE)
    },
    [actionTypes.LOAD_BRACKET_BY_KEY]({ commit }, key) {
      localforage.getItem(key).then(value => {
        const state = JSON.parse(value)
        commit(mutationTypes.INITIALIZE_BRACKET_STATE, state)
      })
    },
    [actionTypes.SHUFFLE]({ commit, dispatch, state }) {
      const seed = generateSeedFromIdentifiers(
        Object.keys(state.bracket.participants)
      )

      commit(mutationTypes.INITIALIZE_BRACKET_STATE, {
        ...state.bracket,
        seed,
      })

      dispatch(actionTypes.STORE_CURRENT_STATE)
    },
    [actionTypes.STORE_CURRENT_STATE]({ state }) {
      const newState = { ...state.bracket, lastModified: +new Date() }

      localforage
        .setItem(state.bracket.id, JSON.stringify(newState))
        .then(() => router.push(`/bracket/local/${state.bracket.id}`))
    },
    [actionTypes.VALIDATE_RESULTS]({ commit, dispatch, state }) {
      const { bracket } = state

      commit(mutationTypes.INITIALIZE_BRACKET_STATE, {
        ...bracket,
        results: validateResults(
          bracket.participants,
          bracket.results,
          bracket.seed
        ),
      })

      dispatch(actionTypes.STORE_CURRENT_STATE)
    },
  },
})
