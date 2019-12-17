import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import VConsole from 'vconsole';
Vue.config.productionTip = false;

import Cube from "cube-ui";

Vue.use(Cube);
// new VConsole();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
