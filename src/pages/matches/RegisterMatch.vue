<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/partidas">Partidas</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ isEditing ? "Editar Partida" : "Registrar Partida" }}
          </li>
        </ol>
      </nav>

      <!-- Seleção de Times, Data e Local -->
      <div class="match-info">
        <div class="form-group">
          <label>Time da Casa:</label>
          <select v-model="match.homeTeamId" required>
            <option value="">Selecione</option>
            <option v-for="team in teams" :key="team._id" :value="team._id">{{ team.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Time Visitante:</label>
          <select v-model="match.awayTeamId" required>
            <option value="">Selecione</option>
            <option v-for="team in teams" :key="team._id" :value="team._id">{{ team.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Data:</label>
          <input type="date" v-model="match.date" required />
        </div>

        <div class="form-group">
          <label>Local:</label>
          <input type="text" v-model="match.location" placeholder="Ex: Ginásio Municipal" required />
        </div>
      </div>

      <!-- Jogadores e Estatísticas -->
      <div class="players-container">
        <!-- Time da Casa -->
        <div class="team-card" v-if="homePlayers.length">
          <h3>{{ homeTeamName }}</h3>
          <div class="players-grid">
            <div class="player-card" v-for="player in homePlayers" :key="player._id">
              <img :src="player.imageUrl || '/null.jpg'" alt="player image" />
              <h4>{{ player.name }}</h4>
              <p>{{ player.mainPosition }}</p>
              <div class="stats">
                <label>A Pass<input type="number" v-model.number="player.APass" min="0" /></label>
                <label>B Pass<input type="number" v-model.number="player.BPass" min="0" /></label>
                <label>C Pass<input type="number" v-model.number="player.CPass" min="0" /></label>
                <label>A Set<input type="number" v-model.number="player.ASet" min="0" /></label>
                <label>B Set<input type="number" v-model.number="player.BSet" min="0" /></label>
                <label>C Set<input type="number" v-model.number="player.CSet" min="0" /></label>
                <label>Points<input type="number" v-model.number="player.points" min="0" /></label>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Visitante -->
        <div class="team-card" v-if="awayPlayers.length">
          <h3>{{ awayTeamName }}</h3>
          <div class="players-grid">
            <div class="player-card" v-for="player in awayPlayers" :key="player._id">
              <img :src="player.imageUrl || '/null.jpg'" alt="player image" />
              <h4>{{ player.name }}</h4>
              <p>{{ player.mainPosition }}</p>
              <div class="stats">
                <label>A Pass<input type="number" v-model.number="player.APass" min="0" /></label>
                <label>B Pass<input type="number" v-model.number="player.BPass" min="0" /></label>
                <label>C Pass<input type="number" v-model.number="player.CPass" min="0" /></label>
                <label>A Set<input type="number" v-model.number="player.ASet" min="0" /></label>
                <label>B Set<input type="number" v-model.number="player.BSet" min="0" /></label>
                <label>C Set<input type="number" v-model.number="player.CSet" min="0" /></label>
                <label>Points<input type="number" v-model.number="player.points" min="0" /></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-primary" @click="saveMatch">
        {{ isEditing ? "Atualizar Partida" : "Registrar Partida" }}
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import MatchService from "@/api/MatchService";
import TeamService from "@/api/TeamService";
import PlayerService from "@/api/PlayerService";

const route = useRoute();
const router = useRouter();
const matchId = route.params.id as string;
const isEditing = ref(false);

const match = ref({
  homeTeamId: "",
  awayTeamId: "",
  date: "",
  location: "",
});

const teams = ref([]);
const homePlayers = ref([]);
const awayPlayers = ref([]);
const homeTeamName = ref("");
const awayTeamName = ref("");

const fetchTeams = async () => {
  const res = await TeamService.getTeam({});
  teams.value = res.data;
};

watch(
  () => match.value.homeTeamId,
  async (newVal) => {
    if (newVal) {
      const team = teams.value.find((t) => t._id === newVal);
      homeTeamName.value = team?.name || "";
      const res = await PlayerService.getPlayersForTeam(newVal);
      homePlayers.value = res.data.map((p: any) => ({ ...p }));
    } else {
      homePlayers.value = [];
      homeTeamName.value = "";
    }
  }
);
    
watch(
  () => match.value.awayTeamId,
  async (newVal) => {
    if (newVal) {
      const team = teams.value.find((t) => t._id === newVal);
      awayTeamName.value = team?.name || "";
      const res = await PlayerService.getPlayersForTeam(newVal);
      awayPlayers.value = res.data.map((p: any) => ({ ...p }));
    } else {
      awayPlayers.value = [];
      awayTeamName.value = "";
    }
  }
);

const fetchMatch = async () => {
  if (!matchId) return;
  isEditing.value = true;
  const res = await MatchService.getMatchById(matchId);
  match.value.homeTeamId = res.data.homeTeam._id;
  match.value.awayTeamId = res.data.awayTeam._id;
  match.value.date = res.data.date.split("T")[0];
  match.value.location = res.data.location;

  homePlayers.value = res.data.homeTeam.players.map((p: any) => ({ ...p }));
  awayPlayers.value = res.data.awayTeam.players.map((p: any) => ({ ...p }));
  homeTeamName.value = res.data.homeTeam.name;
  awayTeamName.value = res.data.awayTeam.name;
};

const saveMatch = async () => {
  try {
    const payload = {
      homeTeamId: match.value.homeTeamId,
      awayTeamId: match.value.awayTeamId,
      date: match.value.date,
      location: match.value.location,
      homePlayers: homePlayers.value,
      awayPlayers: awayPlayers.value,
    };

    if (isEditing.value) {
      await MatchService.updateMatch(matchId, payload);
    } else {
      await MatchService.createMatch(payload);
    }

    router.push("/partidas");
  } catch (error) {
    console.error("Error saving match:", error);
  }
};

onMounted(() => {
  fetchTeams();
  fetchMatch();
});
</script>

<style scoped>
/* === Seção de Informações da Partida === */
.match-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1 1 200px;
}

input,
select {
  padding: 6px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* === Players Grid === */
.players-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.team-card {
  flex: 1 1 48%;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}

.team-card h3 {
  text-align: center;
  margin-bottom: 15px;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.player-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  text-align: center;
}

.player-card img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 5px;
}

.player-card h4 {
  margin: 5px 0;
  font-size: 0.9rem;
}

.player-card p {
  margin: 0 0 10px 0;
  font-size: 0.8rem;
  color: #555;
}

.stats label {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 3px;
}

.stats input {
  width: 50px;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Botão */
button.btn {
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 1rem;
}
</style>
