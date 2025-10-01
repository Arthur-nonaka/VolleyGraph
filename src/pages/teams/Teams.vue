<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">Times</li>
        </ol>
      </nav>
      <button>
        <router-link
          to="/times/registrar"
          style="text-decoration: none; color: black; padding: 20px 10px"
        >
          Novo Time
        </router-link>
      </button>

      <div class="name-filter">
        <input
          type="text"
          placeholder="Pesquise um nome"
          name="name"
          v-model="filter.name"
        />
      </div>

      <div class="player-container w-100">
        <div class="filters">
          Filtros
          <div class="form-check">
            <select>
              <option value="">Selecione uma cidade</option>
              <option
                v-for="team in teams"
                :key="team._id"
                :value="team.address"
              >
                {{ team.address }}
              </option>
            </select>
          </div>
        </div>
        <table class="table table-striped">
          <!-- <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead> -->
          <tbody>
            <tr v-for="team in filteredTeams" :key="team._id">
              <td><img :src="team.logo" /></td>
              <td>{{ team.name }}</td>
              <td>{{ team.address }}</td>
              <td>
                <button
                  class="btn btn-primary btn-sm"
                  @click="seeTeam(team._id)"
                >
                  Ver
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteTeam(team._id)"
                >
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
import PlayerCard from "@/components/PlayerCard.vue";
import TeamService from "@/api/TeamService";
import { ref, onMounted } from "vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const filter = ref({
  city: "",
  name: "",
});

const teams = ref([]);

const deleteTeam = async (id: string) => {
  try {
    await TeamService.deleteTeam(id);
    teams.value = teams.value.filter((team) => team._id !== id);
  } catch (error) {
    console.error("Error deleting team:", error);
  }
};

const seeTeam = (id: string) => {
  router.push(`/times/${id}`);
};

const fetchTeams = async () => {
  try {
    const response = await TeamService.getTeam({
      name: filter.value.name,
      address: filter.value.city,
    });
    teams.value = response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
  }
};

const filteredTeams = computed(() => {
  const filtered = teams.value.filter((team) => {
    const matchesName =
      !filter.value.name ||
      team.name.toLowerCase().includes(filter.value.name.toLowerCase());

    const matchesCity =
      !filter.value.city ||
      team.address.toLowerCase().includes(filter.value.city.toLowerCase());

    return matchesName && matchesCity;
  });

  return filtered;
});

onMounted(fetchTeams);
</script>

<style scoped>
.player-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
  margin-bottom: 20px;
}

img {
  width: 100px;
  height: 100px;
  /* border-radius: 50%; */
}

.filters {
  width: 250px;
  padding-right: 20px;
  border-right: 1px solid #ccc;
}

.players {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-left: 20px;
}

.name-filter {
  width: 100%;
  padding: 20px 20px 0px 20px;
  display: flex;
  justify-content: flex-end;
}

.name-filter input {
  width: 100%;
  padding: 4px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

@media (max-width: 1500px) {
  .players {
    grid-template-columns: repeat(3, 1fr);
  }
}

<style scoped>
/* === LISTAGEM DE TIMES (compacta) === */

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

td img {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}

td:first-child {
  width: 60px;
}

td:nth-child(2) {
  font-weight: 600;
  color: #333;
}

td:nth-child(3) {
  color: #666;
  font-size: 0.85rem;
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
