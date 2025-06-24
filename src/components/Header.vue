<template>
  <Menu />
  <header>
    <router-link to="/" style="text-decoration: none"
      ><div class="title">VolleyGraph</div></router-link
    >
    <div class="cart-container">
      <Cart />
      <router-link to="/login" class="router"
        ><div class="avatar"></div
      ></router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import Menu from "./Menu.vue";
import Cart from "./Cart.vue";
</script>

<style scoped>
header {
  position: relative;
  background-color: var(--vt-c-blue);
  color: white;
  padding: 10px;
  height: 10vh;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.title {
  font-size: 2.8rem;
  font-family: "Britannic";
  color: white;
  text-decoration: none;
}

.cart-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  right: 10px;
}

.router {
  position: absolute;
  display: flex;
  align-items: center;

  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  margin-left: auto;
  right: 10px;
  background-image: url("../assets/avatar.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
