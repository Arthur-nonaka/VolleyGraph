<template>
  <div class="player-card">
    <router-link :to="`/jogadores/${player._id}`">
      <div class="img-container">
        <img
          :src="player.imageUrl ? player.imageUrl : '/null.jpg'"
          alt="Player Image"
          style="width: 100%; height: 200px"
        />
      </div>
      <div class="player-info">
        <h2>{{ player.name }} - {{ player.mainPosition }}</h2>
        <p>Altura: {{ player.height }} cm</p>
      </div>
    </router-link>
    <div class="player-edit">
      <router-link :to="`/jogadores/editar/${player._id}`"
        ><button>🖊</button></router-link
      >
      <button class="delete" @click="handleDelete">🗑</button>
    </div>
    <!-- <p v-if="player.subPosition">
          Posição Secundária: {{ player.subPosition }}
        </p> -->
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import PlayerService from "@/api/PlayerService";

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["playerDeleted"]);

const { player } = props;

const handleDelete = async () => {
  const id = player._id;
  try {
    await PlayerService.deletePlayer(id);

    emit("playerDeleted");
  } catch (error) {
    console.error("Error deleting player:", error);
  }
};
</script>

<style scoped>
.player-card {
  position: relative;
  border-radius: 5px;
  background-color: #f9f9f9;
  height: 300px;
  text-decoration: none;
  /* width: 20vw; */
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

a {
  text-decoration: none;
  color: black;
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

.player-edit {
  position: absolute;
  top: 5px;
  right: 5px;
}

.player-edit button {
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #333;
  background-color: var(--vt-c-orange);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  transition: background-color 0.3s ease, border 0.3s ease, color 0.3s ease,
    width 0.3s ease, height 0.3s ease;
}

.player-edit button:hover {
  background-color: var(--vt-c-orange-dark);
  color: var(--vt-c-orange);
  border: 2px solid black;
  width: 37px;
  height: 37px;
  transition: background-color 0.3s ease, border 0.3s ease, color 0.3s ease,
    width 0.3s ease, height 0.3s ease;
}

.player-edit .delete {
  background-color: var(--vt-c-red);
  color: #fff;
  transition: background-color 0.3s ease, border 0.3s ease, color 0.3s ease,
    width 0.3s ease, height 0.3s ease; 
}

.player-edit .delete:hover {
  background-color: var(--vt-c-red-dark);
  color: var(--vt-c-red);
}
</style>
