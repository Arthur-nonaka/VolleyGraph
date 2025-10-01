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

        <router-link to="/" class="option" @click="logout">
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

        <div v-else-if="!loading">
          <div v-for="order in orders" :key="order._id" class="order-card">
            <div class="order-header">
              <span><strong>Pedido:</strong> #{{ order._id?.substring(0, 8) || 'N/A' }}</span>
              <span><strong>Data:</strong> {{ formatDate(order.createdAt) }}</span>
              <span><strong>Status:</strong> {{ getStatusInPortuguese(order.status) }}</span>
            </div>

            <div class="order-items">
              <div
                v-for="item in order.items"
                :key="item.itemId"
                class="order-item"
              >
                <img :src="item.image || '/volleyball.png'" alt="Produto" />
                <div>
                  <p>
                    <strong>{{ item.itemName }}</strong>
                  </p>
                  <p v-if="item.selectedColor">Cor: {{ item.selectedColor }}</p>
                  <p v-if="item.selectedSize">Tamanho: {{ item.selectedSize }}</p>
                  <p>Quantidade: {{ item.quantity }}</p>
                  <p>Preço: R$ {{ item.unitPrice.toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <div class="order-footer">
              <strong>Total: R$ {{ order.total.toFixed(2) }}</strong>
              <div v-if="order.discount && order.discount > 0" class="discount-info">
                <small>Desconto aplicado: {{ order.discount }}%</small>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="loading" style="text-align: center; padding: 20px">
          <p>Carregando pedidos...</p>
        </div>

        <div v-else-if="error" style="text-align: center; padding: 20px; color: red">
          <p>{{ error }}</p>
          <button @click="loadOrders" class="retry-button">Tentar novamente</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Header from "../../components/Header.vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import SaleService, { Sale, SaleStatus } from "../../api/SaleService";

const router = useRouter();

const orders = ref<Sale[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const getStatusInPortuguese = (status: SaleStatus): string => {
  switch (status) {
    case SaleStatus.PENDING:
      return "Aguardando confirmação";
    case SaleStatus.CONFIRMED:
      return "Confirmado";
    case SaleStatus.SHIPPED:
      return "Enviado";
    case SaleStatus.DELIVERED:
      return "Entregue";
    case SaleStatus.CANCELLED:
      return "Cancelado";
    default:
      return "Status desconhecido";
  }
};

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "Data não disponível";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pt-BR");
};

const loadOrders = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    const salesData = await SaleService.getSalesByUser(userId);
    orders.value = salesData;
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
    error.value = "Erro ao carregar os pedidos. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadOrders();
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("userId");
  router.push("/login");
}
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

.discount-info {
  margin-top: 5px;
  font-size: 0.9em;
  color: #666;
}

.retry-button {
  padding: 10px 20px;
  background-color: var(--vt-c-blue);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-button:hover {
  background-color: var(--vt-c-blue-dark);
}
</style>
