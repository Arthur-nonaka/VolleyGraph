<template>
  <Header />

  <main>
    <section class="container">
      <Banner />
      <p>Partidas Recentes</p>
      <Carousel />
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
import Carousel from "../components/Carousel.vue";
import Banner from "../components/Banner.vue";
</script>

<style scoped>
main {
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 20px;
  width: 80vw;
  background-color: var(--vt-c-white);
}

p {
  margin-top: 10px;
  font-size: 1.7rem;
  font-family: "Britannic";
  margin-left: 20px;
}
</style>
