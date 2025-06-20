<template>
  <Header />

  <main>
    <div class="title">
      <router-link to="/user" class="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span style="font-size: 1.2em">Minha Conta</span>
      </router-link>
    </div>

    <div class="container">
      <div class="options">
        <router-link to="./my-page" class="option">
          <img src="/perfil.png" alt="Perfil" />
          <h2>Meu Cadastro</h2>
        </router-link>

        <div class="option option-selected">
          <img src="/carrinho.png" alt="Pedidos" />
          <h2 class="h2-selected">Meus Pedidos</h2>
        </div>

        <router-link to="./address" class="option">
          <img src="/endereco.png" alt="Endereço" />
          <h2>Meus Endereços</h2>
        </router-link>

        <router-link to="./change-password" class="option">
          <img src="/trocarsenha.png" alt="Senha" />
          <h2>Trocar Senha</h2>
        </router-link>

        <router-link to="/" class="option">
          <img src="/sair.png" alt="Sair" />
          <h2>Sair</h2>
        </router-link>
      </div>

      <div class="user-container">
        <h2 style="margin-bottom: 20px">Histórico de Pedidos</h2>

        <div
          v-if="orders.length === 0"
          style="text-align: center; padding: 20px"
        >
          <p>Você ainda não fez nenhum pedido.</p>
        </div>

        <div v-else>
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <span><strong>Pedido:</strong> #{{ order.id }}</span>
              <span><strong>Data:</strong> {{ order.date }}</span>
              <span><strong>Status:</strong> {{ order.status }}</span>
            </div>

            <div class="order-items">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="order-item"
              >
                <img :src="item.image" alt="Produto" />
                <div>
                  <p>
                    <strong>{{ item.name }}</strong>
                  </p>
                  <p>Quantidade: {{ item.quantity }}</p>
                  <p>Preço: R$ {{ item.price.toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <div class="order-footer">
              <strong>Total: R$ {{ order.total.toFixed(2) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Header from "../../components/Header.vue";
import { ref } from "vue";

interface OrderItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  status: string;
  items: OrderItem[];
  total: number;
}

const orders = ref<Order[]>([
  {
    id: 1023,
    date: "03/06/2025",
    status: "Entregue",
    total: 129.9,
    items: [
      {
        id: 1,
        name: "Espada Longa",
        image: "/espada.png",
        quantity: 1,
        price: 89.9,
      },
      {
        id: 2,
        name: "Poção de Vida",
        image: "/pocao.png",
        quantity: 2,
        price: 20.0,
      },
    ],
  },
  {
    id: 1022,
    date: "28/05/2025",
    status: "Cancelado",
    total: 59.9,
    items: [
      {
        id: 3,
        name: "Armadura de Couro",
        image: "/armadura.png",
        quantity: 1,
        price: 59.9,
      },
    ],
  },
]);
</script>

<style scoped>
@import "../../assets/user.css";


.order-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
}

.order-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.95em;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  display: flex;
  gap: 15px;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.order-footer {
  text-align: right;
  margin-top: 10px;
  font-size: 1.1em;
  color: var(--vt-c-blue);
}
</style>
