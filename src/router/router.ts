import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Teams from '../pages/Teams.vue';
import Login from '../pages/Login.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/teams', component: Teams },
  { path: '/login', component: Login }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;