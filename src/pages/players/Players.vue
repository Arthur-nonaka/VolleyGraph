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
          <div
            class="form-check"
            v-for="position in positions"
            :key="position.value"
          >
            <input
              type="checkbox"
              class="form-check-input"
              :id="position.value"
              :value="position.value"
              v-model="filter.mainPositions"
            />
            <label class="form-check-label" :for="position.value">
              {{ position.label }}
            </label>
          </div>
        </div>
        <div class="players">
          <PlayerCard
            v-for="player in players"
            :key="player._id"
            :player="player"
            class="g-col-4"
            @player-deleted="fetchPlayers"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import PlayerCard from "@/components/PlayerCard.vue";
import PlayerService, { positionTranslations } from "@/api/PlayerService";
import { ref, onMounted, watch } from "vue";
import { computed } from "vue";

const positions = [
  { value: "Opposite Hitter", label: "Oposto" },
  { value: "Middle Blocker", label: "Central" },
  { value: "Outside Hitter", label: "Ponta" },
  { value: "Setter", label: "Levantador" },
  { value: "Libero", label: "Líbero" },
  { value: "Server Specialist", label: "Especialista em saque" },
  { value: "Defense Specialist", label: "Especialista em defesa" },
];

const filter = ref({
  mainPositions: [],
  name: "",
});

const players = ref([]);
const fetchPlayers = async () => {
  try {
    const response = await PlayerService.getPlayer({
      name: filter.value.name,
      mainPositions: filter.value.mainPositions,
    });
    players.value = response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
  }
};

watch(
  filter,
  () => {
    fetchPlayers();
  },
  { deep: true }
);

onMounted(fetchPlayers);
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

.filters {
  width: 250px;
  padding-right: 20px;
  border-right: 1px solid #ccc;
  color: black;
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
