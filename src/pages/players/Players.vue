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

      <div class="player-container w-100">
        <PlayerCard
          v-for="player in players"
          :player="player"
          class="g-col-4"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import PlayerCard from "@/components/PlayerCard.vue";
import PlayerService, { positionTranslations } from "@/api/PlayerService";
import { ref, onMounted } from "vue";

const players = ref([]);
onMounted(async () => {
  try {
    const response = await PlayerService.getPlayer();
    players.value = response.data.map((player: any) => ({
      ...player,
      mainPosition:
        positionTranslations[player.mainPosition] || player.mainPosition,
      subPosition:
        positionTranslations[player.subPosition] || player.subPosition,
    }));
  } catch (error) {
    console.error("Error fetching players:", error);
  }
});
</script>

<style scoped>
.player-container {
  /* box-sizing: border-box; */
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
}

@media (max-width: 1200px) {
  .player-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
