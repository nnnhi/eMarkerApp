import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueYoutube from "vue-youtube";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import i18n from './plugins/i18n'

Vue.use(CKEditor);
Vue.use(VueYoutube);
Vue.config.productionTip = false;
Vue.config.errorHandler = function(err, vm, info) {
  vm.$store.dispatch("alert/turnOnErrorAlert", `Error: ${err.message}\nInfo: ${info}`)
  console.log(`Error: ${err.toString()}\nInfo: ${info}`);
}
new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
