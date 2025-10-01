<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">Itens</li>
        </ol>
      </nav>
      <button v-if="isAdmin">
        <router-link
          to="/loja/item/registrar"
          style="text-decoration: none; color: black; padding: 20px 10px"
        >
          Novo Item
        </router-link>
        <router-link
          to="/loja/cupom/registrar"
          style="text-decoration: none; color: black; padding: 20px 10px"
        >
          Novo Cupom
        </router-link>
        <router-link
          to="/loja/cupom/mostrar"
          style="text-decoration: none; color: black; padding: 20px 10px"
        >
          Mostrar Cupons
        </router-link>
        <router-link
          to="/admin/vendas/relatorio"
          style="text-decoration: none; color: black; padding: 20px 10px"
        >
          Relatório de Vendas
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
          <div class="form-group">
            <v-range-slider
              v-model="priceRange"
              :min="0"
              :max="highest"
              :step="10"
              thumb-label
              class="mt-4"
              color="primary"
              label="Preço"
            ></v-range-slider>
            <div class="form-group">
              <label for="priceMin"> Minino</label>
              <input type="number" v-model="priceRange[0]" />
              <label for="priceMin"> Maximo</label>
              <input type="number" v-model="priceRange[1]" />
            </div>
          </div>
          <label for="type">Tipo</label>
          <select id="type" class="form-select" v-model="filter.type">
            <option value="">Todos</option>
            <option value="clothes">Roupas</option>
            <option value="shoes">Tenis</option>
            <option value="ball">Bola</option>
            <option value="accessories">Acessórios</option>
          </select>
        </div>
        <div class="players">
          <ItemCard
            v-for="item in items"
            :key="item._id"
            :item="item"
            :isAdmin="isAdmin"
            class="g-col-4"
            @item-deleted="fetchItems"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import ItemCard from "@/components/ItemCard.vue";
import ItemService from "@/api/ItemService";
import UserService from "@/api/UserService";
import { ref, onMounted, watch } from "vue";

const filter = ref({
  minPrice: 0,
  maxPrice: 1000,
  name: "",
  type: "",
});

const highest = ref(1000);

const items = ref([]);
const fetchItems = async () => {
  try {
    const response = await ItemService.getItem({
      priceMin: filter.value.minPrice,
      priceMax: filter.value.maxPrice,
      name: filter.value.name,
      type: filter.value.type,
    });
    items.value = response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

const priceRange = ref<[number, number]>([0, highest.value]);

watch(
  () => [priceRange.value[0], priceRange.value[1]],
  (newVal) => {
    filter.value.minPrice = newVal[0];
    filter.value.maxPrice = newVal[1];
  }
);

watch(
  filter,
  () => {
    fetchItems();
  },
  { deep: true }
);

const isAdmin = ref(false);

onMounted(async () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    try {
      const response = await UserService.getUserById(userId);
      isAdmin.value = response.data.isAdmin === true;
      // (Opcional) Atualize o localStorage para manter sincronizado:
      localStorage.setItem("isAdmin", isAdmin.value ? "true" : "false");
    } catch (e) {
      isAdmin.value = false;
    }
  } else {
    isAdmin.value = false;
  }
  fetchItems();

  try {
    const response = await ItemService.getHighstPriceItem();
    highest.value = response.data.price || 1000;
  } catch (error) {
    console.error("Error fetching highest price item:", error);
    highest.value = 1000;
  }
});
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
