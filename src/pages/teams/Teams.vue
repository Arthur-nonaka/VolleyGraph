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
</style>
