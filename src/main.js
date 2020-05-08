import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import Mixin from "./mixin";
import { initialState } from "./store";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
Vue.config.productionTip = false;
Vue.use(BootstrapVue);

library.add(fas, far, fab);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.prototype.$authClientSecret = process.env.MIX_AUTH_CLIENT_SECRET;

// ログインチェック
// router.beforeEach((to, from, next) => {
//   if (to.name === "ログイン") {
//     next();
//     return;
//   }
//   const requiresAuth = localStorage.access_token;
//   if (requiresAuth) {
//     next();
//   } else {
//     next({
//       path: "/Login",
//       query: { redirect: to.fullPath },
//     });
//   }
// });

Vue.mixin(Mixin);

new Vue({
  router,
  store,
  created() {
    // created時に初期StateをlocalStorageに保存しておく。
    localStorage.setItem("initialState", JSON.stringify(initialState));
  },
  render: (h) => h(App),
}).$mount("#app");
