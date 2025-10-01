<template>
  <Header />

  <div class="team-page">
    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else>
      <!-- ------------------- TEAM INFO ------------------- -->
      <div class="team-info">
        <img
          :src="team.logo || '/null.jpg'"
          alt="Team Logo"
          class="team-logo"
        />
        <div class="team-details">
          <h2>{{ team.name || "Sem nome" }}</h2>
          <p>{{ team.address || "Sem endereço" }}</p>
        </div>
      </div>

      <!-- ------------------- ADD PLAYER ------------------- -->
      <div class="add-player">
        <h3>Adicionar Jogador</h3>
        <select v-model="selectedPlayer" class="player-select">
          <option value="" disabled>Selecione um jogador</option>
          <option
            v-for="player in allPlayers"
            :key="player._id"
            :value="player._id"
          >
            {{ player.name }}
          </option>
        </select>
        <button class="btn-add" @click="addPlayer">Adicionar Jogador</button>
      </div>

      <!-- ------------------- PLAYERS GRID ------------------- -->
      <h3>Jogadores</h3>
      <div v-if="players.length === 0" class="no-players">
        Nenhum jogador encontrado.
      </div>
      <div v-else class="players-grid">
        <PlayerCard
          v-for="player in players"
          :key="player._id"
          :player="player"
          :is-admin="isAdmin"
          :showRemoveButton="true"
          @player-deleted="removePlayer"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import PlayerCard from "@/components/PlayerCard.vue";
import teamService, { getTeamById, addPlayerToTeam } from "@/api/TeamService";
import { getPlayer, getPlayersForTeam } from "@/api/PlayerService";

const route = useRoute();

const isAdmin = localStorage.getItem("isAdmin");

const team = ref<any>({
  name: "",
  address: "",
  logo: null,
});
const loading = ref(true);
const players = ref<any[]>([]);
const allPlayers = ref<any[]>([]);
const selectedPlayer = ref<string | null>("");

// ------------------- FETCH TEAM DATA -------------------
const fetchTeamData = async () => {
  loading.value = true;
  const teamId = route.params.id as string;

  try {
    // Buscar dados do time
    const teamData = await teamService.getTeamById(teamId);
    team.value = teamData.data;
    players.value = (teamData.data.players || []).map((p: any) => ({
      _id: p._id,
      name: p.name || "Sem nome",
      age: p.age || null,
      height: p.height || 0,
      imageUrl: p.imageUrl || null,
      mainPosition: p.mainPosition || "Desconhecida",
      subPosition: p.subPosition || null,
    }));

    // Buscar todos os jogadores para o select
    const allPlayersData = await getPlayer({});
    allPlayers.value = (allPlayersData.data || []).map((p: any) => ({
      _id: p._id,
      name: p.name || "Sem nome",
    }));
  } catch (error) {
    console.error("Erro ao buscar dados do time ou jogadores:", error);
  } finally {
    loading.value = false;
  }
};

// ------------------- ADD PLAYER -------------------
const addPlayer = async () => {
  if (!selectedPlayer.value || selectedPlayer.value === "") {
    alert("Selecione um jogador para adicionar.");
    return;
  }

  try {
    const teamId = route.params.id as string;
    const formData = new FormData();
    formData.append("playerId", selectedPlayer.value);
    formData.append("teamId", teamId);

    await teamService.addPlayerToTeam(formData);
    selectedPlayer.value = "";
    await fetchTeamData();
  } catch (error: any) {
    console.error("Erro ao adicionar jogador ao time:", error);
    const errorMessage =
      error.response?.data?.message || "Erro ao adicionar jogador.";
    alert(errorMessage);
  }
};

const removePlayer = async (playerId: string) => {
  if (!confirm("Deseja realmente remover este jogador do time?")) return;

  // validação rápida
  if (
    !playerId ||
    playerId.length !== 24 ||
    (route.params.id as string).length !== 24
  ) {
    alert("Erro: IDs inválidos");
    return;
  }

  try {
    await teamService.removePlayerFromTeam({
      playerId: String(playerId),
      teamId: String(route.params.id),
    });
    await fetchTeamData();
  } catch (error: any) {
    console.error(error);
    alert(error.response?.data?.message || "Erro ao remover jogador.");
  }
};

onMounted(fetchTeamData);
</script>

<style scoped>
.team-page {
  padding: 25px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.loading {
  font-size: 1.3rem;
  text-align: center;
  color: var(--vt-c-orange);
  margin-top: 50px;
}

/* ------------------- TEAM INFO ------------------- */
.team-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #fff8f0;
  border-radius: 12px;
  padding: 12px 15px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
}

.team-logo {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid var(--vt-c-orange);
}

.team-details h2 {
  margin: 0 0 4px 0;
  font-size: 2.4rem;
  color: var(--vt-c-orange-dark);
}

.team-details p {
  margin: 0;
  color: #555;
  font-size: 1.5rem;
}

/* ------------------- ADD PLAYER ------------------- */
.add-player {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.player-select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  min-width: 200px;
}

.btn-add {
  background-color: var(--vt-c-orange);
  border: none;
  color: #fff;
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background-color: var(--vt-c-orange-dark);
  color: #fff;
}

/* ------------------- PLAYERS GRID ------------------- */
.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.no-players {
  font-style: italic;
  color: #999;
  text-align: center;
}

/* ------------------- RESPONSIVIDADE ------------------- */
@media (max-width: 768px) {
  .team-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10px;
  }

  .team-logo {
    margin-bottom: 10px;
    width: 90px;
    height: 90px;
  }
}
</style>
