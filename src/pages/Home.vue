<template>
  <Header />

  <main>
    <section class="container">
      <Banner />
      <p style="color: black;">Partidas Recentes</p>
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

.container {
  margin-top: 20px;
}

p {
  margin-top: 10px;
  font-size: 1.7rem;
  font-family: "Britannic";
  margin-left: 20px;
}
</style>
