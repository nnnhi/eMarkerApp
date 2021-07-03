import Vue from "vue";

export default {
  namespaced: true,
  state: {
    alert : {
      show : false,
      message : "Information",
      type : 'error'
    }
  },
  getters: {
  },
  mutations: {
    TURN_ON_ALERT (state, payload) {
      Vue.set(state.alert, "show", true);
      Vue.set(state.alert, "message", payload.message);
      Vue.set(state.alert, "type", payload.type);
      setTimeout(() => {
        Vue.set(state.alert, "show", false);
      }, 3000);
      }
  },
  actions: {
    turnOnErrorAlert({ commit }, message) {
      commit('TURN_ON_ALERT', { message: message, type : 'error' });
    },
    turnOnSuccessAlert({ commit }, message) {
      commit('TURN_ON_ALERT', { message: message, type : 'success' });
    },
  }
};
