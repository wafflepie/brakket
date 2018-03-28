import Vue from "vue"
import Vuex from "vuex"
import localforage from "localforage"
import shortid from "shortid"

import {
  generateSeedFromIdentifiers,
  generateResultStructureFromSeed,
} from "./utils"

import router from "./router"

Vue.use(Vuex)

export const actionTypes = {
  GENERATE_NEW_BRACKET: "GENERATE_NEW_BRACKET",
  LOAD_BRACKET_BY_KEY: "LOAD_BRACKET_BY_URL",
  STORE_CURRENT_STATE: "STORE_CURRENT_STATE",
}

export const mutationTypes = {
  CHANGE_SIDE_SCORE: "CHANGE_SIDE_SCORE",
  INITIALIZE_BRACKET_STATE: "INITIALIZE_BRACKET_STATE",
}

// type Participant = { name: string }
// type Participants = Array<Participant>
// type Seed = Array<{ home: number, away: number }>
// type Side = { score: ?number }
// type Match = { home: Side, away: Side, roundIndex: number, matchIndex: number }
// type Round = Array<Match>
// type Results = Array<Round>

// type ExtendedSide = Participant & Side
// type ExtendedMatch = {
//   home: ExtendedSide,
//   away: ExtendedSide,
//   roundIndex: number,
//   matchIndex: number,
//   winner: 'home' | 'away'
// }

export default new Vuex.Store({
  state: {
    bracketId: null,
    participants: [], // Participants
    seed: [], // Seed
    results: [], // Results
  },
  mutations: {
    [mutationTypes.CHANGE_SIDE_SCORE](state, payload) {
      const { roundIndex, matchIndex, side, score } = payload

      state.results[roundIndex][matchIndex][side].score = score
    },
    [mutationTypes.INITIALIZE_BRACKET_STATE](state, payload) {
      Object.entries(payload).forEach(([key, value]) => {
        state[key] = value
      })
    },
  },
  actions: {
    [actionTypes.GENERATE_NEW_BRACKET]({ commit, dispatch }, participants) {
      const seed = generateSeedFromIdentifiers(Object.keys(participants))
      const results = generateResultStructureFromSeed(seed)

      const bracketId = shortid.generate()
      const state = { participants, results, seed, bracketId }

      commit(mutationTypes.INITIALIZE_BRACKET_STATE, state)
      dispatch(actionTypes.STORE_CURRENT_STATE)
    },
    [actionTypes.LOAD_BRACKET_BY_KEY]({ commit }, key) {
      localforage.getItem(key).then(value => {
        const state = JSON.parse(value)
        commit(mutationTypes.INITIALIZE_BRACKET_STATE, state)
      })
    },
    [actionTypes.STORE_CURRENT_STATE]({ state }) {
      localforage
        .setItem(state.bracketId, JSON.stringify(state))
        .then(() => router.push(`/bracket/${state.bracketId}`))
    },
  },
})
