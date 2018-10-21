import Vue from "vue";
import Router from "vue-router";
import MapView from "./views/MapView.vue";
import PlotTest from "./views/PlotTest.vue";
import Stats from "./views/Stats.vue";
import MapNavigator from "./components/MapNavigator.vue";
import MapViewer from "./components/MapViewer.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/map",
      name: "map",
      component: MapView,
      redirect: "/map/2d",
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
    },
    {
      path: "/stats",
      name: "statistics",
      component: Stats
    }
  ]
});
