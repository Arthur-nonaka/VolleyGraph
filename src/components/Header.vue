<template>
  <header>
    <div class="menu"></div>
    <div class="title">VolleyGraph</div>
    <router-link class="router" to="/login"><div class="avatar"></div></router-link>
  </header>
</template>

<style scoped>
header {
  background-color: var(--vt-c-blue);
  color: white;
  padding: 10px;
  height: 10vh;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 2.8rem;
  font-family: "Britannic";
}

.menu {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  left: 10px;
}

/* .avatar {
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
} */

.router{
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
