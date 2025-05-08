<template>
  <div class="menu-container">
    <div @click="toggleMenu" class="menu-button">
      <img src="/volleyball.png" />
    </div>
    <transition name="menu-fade">
      <ul v-if="isMenuOpen" class="menu-options">
        <router-link :to="{ path: '/loja'}" style="text-decoration: none;"><li @click="selectOption('loja')"> Loja</li></router-link>
        <router-link :to="{ path: '/jogadores'}" style="text-decoration: none;"><li @click="selectOption('Jogadores')"> Jogadores</li></router-link>
        <li @click="selectOption('Times')">Times</li>
        <li @click="selectOption('Partidas')">Partidas</li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    selectOption(option) {
      console.log(`Selected: ${option}`);
      this.isMenuOpen = false;
    },
  },
};
</script>

<style scoped>
.menu-container {
  position: absolute;
  display: inline-block;
  display: flex;
  height: 10vh;
  align-items: center;
  left: 10px;
}

.menu-button {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  z-index: 10;
  transition: transform 0.3s ease;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-button:hover {
  cursor: pointer;
  transform: rotate(-45deg);
}

.menu-button:active {
  transform: rotate(260deg);
}

.menu-options {
  position: absolute;
  top: 100%;
  left: -10px;
  background-color: var(--vt-c-blue);
  list-style: none;
  padding: 0;
  font-size: 1.2rem;
  width: 250px;
  height: 400px;
  z-index: 4;
   user-select: none;
}

.menu-options li {
  color: white;
  display: flex;
  justify-content: start;
  padding: 10px;
  cursor: pointer;
}

.menu-options li:hover {
  background-color: var(--vt-c-dark-blue);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: transform 0.3s ease;
}

.menu-fade-enter-from {
  transform: translateY(-400px);
}

.menu-fade-enter-to {
  transform: translateY(0);
}

.menu-fade-leave-from {
  transform: translateY(0);
}

.menu-fade-leave-to {
  transform: translateY(-400px);
}
</style>
