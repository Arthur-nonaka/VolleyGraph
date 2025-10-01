<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">Partidas</li>
        </ol>
      </nav>
      <button>
        <router-link
          to="/partidas/registrar"
          style="text-decoration: none; color: black; padding: 20px 10px"
        >
          Nova Partida
        </router-link>
      </button>

      <div class="name-filter">
        <input
          type="text"
          placeholder="Pesquise por local ou data"
          v-model="filter.search"
        />
      </div>

      <div class="match-container w-100">
        <div class="filters">
          Filtros
          <div class="form-check">
            <select v-model="filter.team">
              <option value="">Selecione um time</option>
              <option v-for="team in allTeams" :key="team._id" :value="team.name">
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>

        <table class="table table-striped">
          <tbody>
            <tr v-for="match in filteredMatches" :key="match._id">
              <td>{{ match.homeTeam.name }} x {{ match.awayTeam.name }}</td>
              <td>{{ formatDate(match.date) }}</td>
              <td>{{ match.location }}</td>
              <td>{{ match.homeTeamScore }} - {{ match.awayTeamScore }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="seeMatch(match._id)">
                  Ver
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteMatch(match._id)">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import MatchService from "@/api/MatchService";
import TeamService from "@/api/TeamService";

const router = useRouter();

const filter = ref({
  search: "",
  team: "",
});

const matches = ref([]);
const allTeams = ref([]);

const fetchMatches = async () => {
  try {
    const response = await MatchService.getMatches();
    matches.value = response.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
  }
};

const fetchTeams = async () => {
  try {
    const response = await TeamService.getTeam({});
    allTeams.value = response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

const filteredMatches = computed(() => {
  return matches.value.filter((match) => {
    const matchesSearch =
      !filter.value.search ||
      match.location.toLowerCase().includes(filter.value.search.toLowerCase()) ||
      match.date.includes(filter.value.search);
    const matchesTeam =
      !filter.value.team ||
      match.homeTeam.name === filter.value.team ||
      match.awayTeam.name === filter.value.team;
    return matchesSearch && matchesTeam;
  });
});

const seeMatch = (id: string) => {
  router.push(`/partidas/${id}`);
};

const deleteMatch = async (id: string) => {
  try {
    await MatchService.deleteMatch(id);
    matches.value = matches.value.filter((match) => match._id !== id);
  } catch (error) {
    console.error("Error deleting match:", error);
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

onMounted(() => {
  fetchMatches();
  fetchTeams();
});
</script>

<style scoped>
.match-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 20px 20px 20px;
}

.filters {
  width: 250px;
  padding-right: 20px;
  border-right: 1px solid #ccc;
}

.name-filter {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: flex-end;
}

.name-filter input {
  width: 100%;
  padding: 4px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* === LISTAGEM DE PARTIDAS (tabela) === */

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

tbody tr {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: background 0.2s ease;
}

tbody tr:hover {
  background: #f8f9fa;
}

td {
  padding: 10px 12px;
  vertical-align: middle;
  font-size: 0.9rem;
}

td:first-child {
  font-weight: 600;
}

td:last-child {
  text-align: right;
}

.btn {
  margin-left: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0069d9;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
