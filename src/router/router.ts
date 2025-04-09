import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Players from '@/pages/players/Players.vue';
import Player from '@/pages/players/Player.vue';
import RegisterPlayer from '@/pages/players/RegisterPlayer.vue';
import Teams from '@/pages/Teams.vue';
import Login from '@/pages/Login.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/teams', component: Teams },
  { path: '/jogadores', component: Players },
  { path: '/jogadores/:id', component: Player },
  { path: '/jogadores/registrar', component: RegisterPlayer },
  { path: '/jogadores/editar/:id', component: RegisterPlayer },
  { path: '/login', component: Login }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;