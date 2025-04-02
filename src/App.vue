<template>
  <Header />

  <main>
    <Banner/>
    <section>
      <h2>Partidas Recentes</h2>
      <Carousel/>
    </section>
  </main>

  <Footer />
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import Carousel from "./components/Carousel.vue";
import Banner from "./components/Banner.vue";
import Footer from "./components/Footer.vue";
</script>

<style scoped>
main {
  width: 100%;
  height: 90vh;
}
</style>