import AuthService from '@/services/auth.service';
import { ProfileService } from "@/services/api.service";

const auth = new AuthService();
auth.getUser().then( async (user) => {
  state.currentUser = user;
  if (user && !user.expired) {
    var profileResponse = await ProfileService.get();
    state.currentUser.profile.name = profileResponse.data.username;
    state.currentUser.profile.email_verified = profileResponse.data.emailConfirmed;
    state.loading = false;
  }
});

const state = {
  currentUser : null,
  loading : true
};
const getters = {
  isVerifiedEmail: state => {
    if (!state.currentUser) return false;
    return (state.currentUser.profile.idp != 'local') || (state.currentUser.profile.idp == 'local' && state.currentUser.profile.email_verified);
  }
};
const mutations = {};
const actions = {
  login(){
    auth.login();
  },
  logout() {
    auth.logout();
  },
  setName({state}, newUsername) {
    state.currentUser.profile.name = newUsername;
  },
  setEmailConfirmed({state}, newValue) {
    state.currentUser.profile.email_verified = newValue;
  }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };