import Vue from "vue";
import Router from "vue-router";
import Index from "./views/index/";
import Test from "./views/test/";

import Photograph from "./views/photograph/";
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "index",
      component: Index
    },
    {
      path: "/photograph",
      name: "photograph",
      component: Photograph
    },
    {
      path: "/test",
      name: "Test",
      component: Test
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
});
