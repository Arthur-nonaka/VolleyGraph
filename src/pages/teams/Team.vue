<script setup lang="ts">
import { ref, onMounted } from "vue";
import PlayerCard from "@/components/PlayerCard.vue";
import Header from "@/components/Header.vue";
import { getTeamById, addPlayerToTeam } from "@/api/TeamService";
import { getPlayersForTeam, getPlayer } from "@/api/PlayerService";
import { useRoute } from "vue-router";

const route = useRoute();
const team = ref(null);
const loading = ref(true);
const players = ref([]);
const allPlayers = ref([]);
const selectedPlayer = ref(null);

const fetchTeamData = async () => {
  const teamId = route.params.id;
  try {
    const teamData = await getTeamById(teamId);
    team.value = teamData.data;

    const playersData = await getPlayersForTeam(teamId);
    players.value = playersData.data;

    const allPlayersData = await getPlayer({});
    allPlayers.value = allPlayersData.data;

    loading.value = false;
  } catch (error) {
    console.error("Erro ao buscar dados do time ou jogadores:", error);
  }
};

const addPlayer = async () => {
  if (!selectedPlayer.value) {
    alert("Selecione um jogador para adicionar.");
    return;
  }

  try {
    const teamId = route.params.id;

    const formData = new FormData();
    formData.append("playerId", selectedPlayer.value);
    formData.append("teamId", teamId);

    await addPlayerToTeam(formData);
    alert("Jogador adicionado com sucesso!");
    fetchTeamData(); // Atualiza a lista de jogadores do time
  } catch (error) {
    console.error("Erro ao adicionar jogador ao time:", error);
    alert("Erro ao adicionar jogador.");
  }
};

onMounted(fetchTeamData);
</script>

<template>
  <Header />
  <div class="team-page">
    <div v-if="loading">Carregando...</div>
    <div v-else>
      <h2>{{ team.name }}</h2>
      <p>{{ team.address }}</p>

      <h3>Adicionar Jogador</h3>
      <div>
        <select v-model="selectedPlayer">
          <option value="" disabled>Selecione um jogador</option>
          <option
            v-for="player in allPlayers"
            :key="player._id"
            :value="player._id"
          >
            {{ player.name }}
          </option>
        </select>
        <button class="btn btn-primary" @click="addPlayer">
          Adicionar Jogador
        </button>
      </div>

      <h3>Jogadores</h3>
      <div v-if="players.length === 0">Nenhum jogador encontrado.</div>
      <div v-else>
        <PlayerCard
          v-for="player in players"
          :key="player._id"
          :player="player"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-page {
  padding: 20px;
}
</style>
