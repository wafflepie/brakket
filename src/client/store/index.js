import Vue from "vue"
import Vuex from "vuex"
import * as R from "ramda"

import initialState from "./model"
import { actions, actionTypes } from "./actions"
import { mutations, mutationTypes } from "./mutations"

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  mutations,
  state: R.clone(initialState),
})

export { actionTypes, mutationTypes, initialState }
