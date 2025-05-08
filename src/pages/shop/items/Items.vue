<template>
    <Header />
    <main>
      <section class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Itens</li>
          </ol>
        </nav>
        <button>
          <router-link
            to="/loja/item/registrar"
            style="text-decoration: none; color: black; padding: 20px 10px"
          >
            Novo Item
          </router-link>
        </button>
  
        <div class="name-filter">
          <input type="text" placeholder="Pesquise um nome" name="name" v-model="filter.name"/>
        </div>
  
        <div class="player-container w-100">
          <div class="filters">
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
            <ItemCard
              v-for="item in filteredItems"
              :key="item._id"
              :item="item"
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
  import { ref, onMounted } from "vue";
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
  
  const items = ref([]);
  const fetchItems = async () => {
    try {
      const response = await ItemService.getItem({
      });
      items.value = response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  
  const filteredItems = computed(() => {
    const filtered = items.value.filter((item) => {
    //   const matchesName =
    //     !filter.value.name ||
    //     item.name.toLowerCase().includes(filter.value.name.toLowerCase());
  
    //   // console.log(filter.value.name);
  
    //   const matchesPosition =
    //     !filter.value.mainPositions.length ||
    //     filter.value.mainPositions.includes(player.mainPosition);
  
    //   return matchesName && matchesPosition;
    });
  
    return filtered;
  });
  
  onMounted(fetchItems);
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
  