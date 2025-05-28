<template>
  <Menu />
  <header>
    <router-link to="/" style="text-decoration: none;"><div class="title">VolleyGraph</div></router-link>
    <router-link class="router" to="/login"><div class="avatar"></div></router-link>
  </header>
</template>

<script setup lang="ts">
import Menu from "./Menu.vue";
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

.router {
  position: absolute;
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
