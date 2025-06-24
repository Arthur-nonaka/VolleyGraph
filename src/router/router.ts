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
import User from "@/pages/user/User.vue";
import MyPage from "@/pages/user/MyPage.vue";
import Orders from "@/pages/user/Orders.vue";
import Address from "@/pages/user/Adress.vue";
import ChangePasswod from "@/pages/user/ChangePassword.vue";
import RegisterCupom from "@/pages/shop/RegisterCupom.vue";
import Cupoms from "@/pages/shop/Cupoms.vue";
import { isAuthenticated } from "./auth";
import { Components } from "bootstrap-vue-3";

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
  { path: "/loja/cupom/registrar", component: RegisterCupom },
  { path: "/loja/cupom/mostrar", component: Cupoms },
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
  { path: "/user/my-page", component: MyPage },
  { path: "/user/orders", component: Orders },
  { path: "/user/address", component: Address },
  { path: "/user/change-password", component: ChangePasswod },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
