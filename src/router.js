import { createRouter, createWebHashHistory } from "vue-router";
import Heka from "./components/heka.vue";
import Car from "./components/Car.vue";
import Robot from "./components/Robot.vue";

const routes = [
  { path: "/", name: "home", redirect: "/Robot" },
  { path: "/heka", name: "heka", component: Heka },
  { path: "/car", name: "Car", component: Car },
  { path: "/Robot", name: "Robot", component: Robot },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
