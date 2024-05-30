import { createRouter, createWebHashHistory } from "vue-router";
import Heka from "./components/heka.vue";

const routes = [
  { path: "/", name: "home", redirect: "/heka" },
  { path: "/heka", name: "heka", component: Heka },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
