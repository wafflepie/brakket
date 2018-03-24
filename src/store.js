import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const types = {
  STORE_PARTICIPANTS: "STORE_PARTICIPANTS",
}

export default new Vuex.Store({
  state: {
    participants: [],
  },
  mutations: {
    [types.STORE_PARTICIPANTS](state, names) {
      state.participants = names.map((name, index) => ({
        id: index,
        name,
      }))
    },
  },
  actions: {
    [types.STORE_PARTICIPANTS]({ commit }, names) {
      commit(types.STORE_PARTICIPANTS, names)
    },
  },
})
