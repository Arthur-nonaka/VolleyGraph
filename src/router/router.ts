import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Players from "@/pages/players/Players.vue";
import Player from "@/pages/players/Player.vue";
import RegisterPlayer from "@/pages/players/RegisterPlayer.vue";
import Teams from "@/pages/teams/Teams.vue";
import Team from "@/pages/teams/Team.vue";
import RegisterTeam from "@/pages/teams/RegisterTeam.vue";
import Login from "@/pages/Login.vue";
import Items from "@/pages/shop/items/Items.vue";
import Item from "@/pages/shop/items/Item.vue";
import RegisterItem from "@/pages/shop/items/RegisterItem.vue";
import User from "@/pages/User.vue";
import { isAuthenticated } from "./auth";

const routes = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true },
  },
  { path: "/teams", component: Teams },
  { path: "/user", component: User },
  { path: "/jogadores", component: Players },
  { path: "/jogadores/:id", component: Player },
  { path: "/jogadores/registrar", component: RegisterPlayer },
  { path: "/jogadores/editar/:id", component: RegisterPlayer },
  { path: "/loja", component: Items },
  { path: "/loja/item/:id", component: Item },
  { path: "/loja/item/registrar", component: RegisterItem },
  { path: "/loja/item/editar/:id", component: RegisterItem },
  { path: "/login", component: Login },
  { path: "/times", component: Teams },
  { path: "/times/:id", component: Team },
  { path: "/times/registrar", component: RegisterTeam },
  { path: "/times/editar/:id", component: RegisterTeam },
  {
    path: "/login",
    component: Login,
    beforeEnter: (to: any, from: any, next: any) => {
      if (isAuthenticated()) {
        next("/user"); // já está logado
      } else {
        next(); // deixa entrar
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
