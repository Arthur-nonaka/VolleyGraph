<template>
  <div class="menu-container">
    <div @click="toggleMenu" class="menu-button"></div>
    <transition name="menu-fade">
      <ul v-if="isMenuOpen" class="menu-options">
        <li @click="selectOption('Loja')">Loja</li>
        <li @click="selectOption('Jogadores')">Jogadores</li>
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
  z-index: 2;
}

.menu-options li {
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
