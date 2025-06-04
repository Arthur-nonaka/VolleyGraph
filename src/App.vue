<template>
  <v-app>
    <v-main>
      <router-view></router-view>

      <Footer />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Footer from "./components/Footer.vue";
</script>
