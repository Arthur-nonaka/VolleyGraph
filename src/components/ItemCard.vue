<template>
  <div class="item-card">
    <router-link :to="`/loja/item/${item._id}`">
      <div class="img-container">
        <img
          :src="item.imageUrl ? item.imageUrl : '/null.jpg'"
          alt="item Image"
          style="width: 100%; height: 200px"
        />
      </div>
      <div class="item-info">
        <h2>{{ item.name }}</h2>
        <p>{{ item.price }}</p>
      </div>
    </router-link>
    <div class="item-edit">
      <router-link :to="`/loja/item/editar/${item._id}`"
        ><button>🖊</button></router-link
      >
      <button class="delete" @click="handleDelete">🗑</button>
    </div>
    <!-- <p v-if="item.subPosition">
            Posição Secundária: {{ item.subPosition }}
          </p> -->
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import itemService from "@/api/ItemService";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["itemDeleted"]);

const { item } = props;

const handleDelete = async () => {
  const id = item._id;
  try {
    await itemService.deleteitem(id);

    emit("itemDeleted");
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};
</script>

<style scoped>
.item-card {
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
.item-info {
  padding: 0.4rem;
}

.item-card h2 {
  font-size: 1.2rem;
  margin: 0 0 8px;
}

.item-card p {
  margin: 4px 0;
}

.item-card p:last-child {
  margin-bottom: 0;
}

.item-edit {
  position: absolute;
  top: 5px;
  right: 5px;
}

.item-edit button {
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

.item-edit button:hover {
  background-color: var(--vt-c-orange-dark);
  color: var(--vt-c-orange);
  border: 2px solid black;
  width: 37px;
  height: 37px;
  transition: background-color 0.3s ease, border 0.3s ease, color 0.3s ease,
    width 0.3s ease, height 0.3s ease;
}

.item-edit .delete {
  background-color: var(--vt-c-red);
  color: #fff;
  transition: background-color 0.3s ease, border 0.3s ease, color 0.3s ease,
    width 0.3s ease, height 0.3s ease;
}

.item-edit .delete:hover {
  background-color: var(--vt-c-red-dark);
  color: var(--vt-c-red);
}
</style>
