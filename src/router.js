import { createRouter, createWebHashHistory } from "vue-router";
import Heka from "./components/heka.vue";
import Car from "./components/Car.vue";

const routes = [
  { path: "/", name: "home", redirect: "/heka" },
  { path: "/heka", name: "heka", component: Heka },
  { path: "/car", name: "Car", component: Car },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
