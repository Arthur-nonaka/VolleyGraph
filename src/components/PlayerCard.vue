<template>
  <div class="player-card">
    <div class="img-container">
      <img
        :src="player.imageUrl"
        alt="Player Image"
        style="width: 100%; height: 200px"
      />
    </div>
    <div class="player-info">
      <h2>{{ player.name }} - {{ player.mainPosition }}</h2>
      <p>Altura: {{ player.height }} cm</p>
      <router-link :to="`/jogadores/editar/${player._id}`"><button>Editar</button></router-link>
      <button>Ecluir</button>
      <!-- <p v-if="player.subPosition">
          Posição Secundária: {{ player.subPosition }}
        </p> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  player: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.player-card {
  border-radius: 5px;
  background-color: #f9f9f9;
  height: 300px;
  /* width: 20vw; */
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
.player-info {
  padding: 0.4rem;
}

.player-card h2 {
  font-size: 1.2rem;
  margin: 0 0 8px;
}

.player-card p {
  margin: 4px 0;
}

.player-card p:last-child {
  margin-bottom: 0;
}
</style>
