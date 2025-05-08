<!-- filepath: /workspaces/VolleyGraph/src/pages/players/PlayerInfo.vue -->
<template>
    <div class="player-info">
      <h1>Informações do Jogador</h1>
      <div v-if="loading">Carregando...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <p><strong>Nome:</strong> {{ player.name }}</p>
        <p><strong>Idade:</strong> {{ player.age }}</p>
        <p><strong>Altura:</strong> {{ player.height }} cm</p>
        <p><strong>Posição Principal:</strong> {{ translatePosition(player.mainPosition) }}</p>
        <p><strong>Posição Secundária:</strong> {{ translatePosition(player.subPosition) || "Nenhuma" }}</p>
        <p><strong>Pontos:</strong> {{ player.points }}</p>
        <p><strong>Pontos de Bloqueio:</strong> {{ player.blockPoints }}</p>
        <p><strong>Pontos de Saque:</strong> {{ player.servePoints }}</p>
        <p><strong>Pontos de Ataque:</strong> {{ player.spikePoints }}</p>
        <p><strong>Aposentado:</strong> {{ player.retired ? "Sim" : "Não" }}</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import PlayerService, { positionTranslations } from "@/api/PlayerService";
  
  export default defineComponent({
    name: "PlayerInfo",
    setup() {
      const route = useRoute();
      const player = ref<any>(null);
      const loading = ref(true);
      const error = ref<string | null>(null);
  
      const fetchPlayer = async () => {
        try {
          const id = route.params.id as string;
          const response = await PlayerService.getPlayerById(id);
          player.value = response.data;
        } catch (err) {
          error.value = "Erro ao carregar informações do jogador.";
        } finally {
          loading.value = false;
        }
      };
  
      const translatePosition = (position: string | null): string | null => {
        return position ? positionTranslations[position] || position : null;
      };
  
      onMounted(fetchPlayer);
  
      return {
        player,
        loading,
        error,
        translatePosition,
      };
    },
  });
  </script>
  
  <style scoped>
  .player-info {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  p {
    margin: 10px 0;
  }
  </style>