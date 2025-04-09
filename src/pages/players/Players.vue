<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">Jogadores</li>
        </ol>
      </nav>
      <button>
        <router-link
          to="/jogadores/registrar"
          style="text-decoration: none; color: black; padding: 20px 10px"
        >
          Novo Jogador
        </router-link>
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
</script>
