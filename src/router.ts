import Vue from "vue";
import Router from "vue-router";
import MapView from "./views/MapView.vue";
import PlotTest from "./views/PlotTest.vue";
import MapNavigator from "./components/MapNavigator.vue";
import MapViewer from "./components/MapViewer.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/map",
      name: "map",
      component: MapView,
      children: [
        {
          path: "2d",
          name: "2d",
          component: MapNavigator
        },
        {
          path: "3d",
          name: "3d",
          component: MapViewer
        }
      ]
    },
    {
      path: "/plottest",
      name: "plottest",
      component: PlotTest
      // component: () =>
      //   import(/* webpackChunkName: "about" */ "./views/PlotTest.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
