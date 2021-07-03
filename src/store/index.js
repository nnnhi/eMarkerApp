import Vue from 'vue'
import Vuex from 'vuex'
import alert from "./modules/alert"
import user from "./modules/user"

Vue.use(Vuex)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  state: {
    loading: false
  },
  mutations: {
    TURN_ON_LOADING (state) {
      Vue.set(state, "loading", true);
      },
    TURN_OFF_LOADING (state) {
        Vue.set(state, "loading", false);
        }
  },
  actions: {
    turnOnLoading({ commit }) {
      commit('TURN_ON_LOADING');
    },
    turnOffLoading({ commit }) {
      commit('TURN_OFF_LOADING');
    },
  },
  modules: {
    alert,
    user
  }
})

export default store
