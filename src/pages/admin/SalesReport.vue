<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/loja">Itens</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Relatório de Vendas
          </li>
        </ol>
      </nav>

      <div class="report-header">
        <div class="header-content">
          <h1>Relatório de Vendas</h1>
          <div class="month-filter">
            <label for="monthFilter">Filtrar por mês:</label>
            <select
              id="monthFilter"
              v-model="selectedMonth"
              @change="filterSalesByMonth"
            >
              <option value="">Todos os meses</option>
              <option
                v-for="month in availableMonths"
                :key="month.value"
                :value="month.value"
              >
                {{ month.label }}
              </option>
            </select>
          </div>
          <div class="header-stats">
            <div class="stat-mini">
              <span class="stat-label">Total de Vendas:</span>
              <span class="stat-value">{{ statistics.totalSales }}</span>
            </div>
            <div class="stat-mini">
              <span class="stat-label">Receita Total:</span>
              <span class="stat-value"
                >R$ {{ statistics.totalRevenue.toFixed(2) }}</span
              >
            </div>
          </div>
        </div>
        <button
          @click="exportReportJson"
          class="export-btn"
          style="background-color: orange"
        >
          <img src="/import-export.png" alt="Exportar Relatório" width="35px" />
          <p style="background-color: orange">JSON</p>
        </button>
        <button
          @click="exportReportCSV"
          class="export-btn"
          style="background-color: green"
        >
          <img src="/import-export.png" alt="Exportar Relatório" width="35px" />
          <p style="background-color: green">Excel</p>
        </button>
      </div>

      <div v-if="loading" class="loading">Carregando relatório...</div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else class="report-content">
        <div class="sales-table-container">
          <h2>Histórico de Vendas</h2>
          <div class="table-responsive">
            <table class="sales-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Pagamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sale in paginatedSales" :key="sale._id">
                  <td>{{ sale._id?.substring(0, 8) || "N/A" }}</td>
                  <td>{{ formatDate(sale.createdAt) }}</td>
                  <td>{{ getUserName(sale.userId) }}</td>
                  <td>
                    <span
                      :class="['status-badge', getStatusClass(sale.status)]"
                    >
                      {{ getStatusText(sale.status) }}
                    </span>
                  </td>
                  <td>{{ sale.items.length }}</td>
                  <td>R$ {{ sale.total.toFixed(2) }}</td>
                  <td>{{ getPaymentMethodText(sale.paymentMethod) }}</td>
                  <td>
                    <button @click="viewSaleDetails(sale)" class="view-btn">
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <button
              @click="currentPage--"
              :disabled="currentPage <= 1"
              class="pagination-btn"
            >
              Anterior
            </button>
            <span class="pagination-info">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="pagination-btn"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedSale" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Detalhes da Venda #{{ selectedSale._id?.substring(0, 8) }}</h3>
            <button @click="closeModal" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="sale-info">
              <p>
                <strong>Data:</strong> {{ formatDate(selectedSale.createdAt) }}
              </p>
              <p>
                <strong>Status:</strong>
                {{ getStatusText(selectedSale.status) }}
              </p>
              <p>
                <strong>Método de Pagamento:</strong>
                {{ getPaymentMethodText(selectedSale.paymentMethod) }}
              </p>
              <p>
                <strong>Subtotal:</strong> R$
                {{ selectedSale.subtotal.toFixed(2) }}
              </p>
              <p v-if="selectedSale.discount">
                <strong>Desconto:</strong> {{ selectedSale.discount }}%
              </p>
              <p>
                <strong>Total:</strong> R$ {{ selectedSale.total.toFixed(2) }}
              </p>
            </div>

            <div class="delivery-address" v-if="selectedSale.deliveryAddress">
              <h4>Endereço de Entrega:</h4>
              <p>
                {{ selectedSale.deliveryAddress.street }},
                {{ selectedSale.deliveryAddress.number }}
              </p>
              <p v-if="selectedSale.deliveryAddress.complement">
                {{ selectedSale.deliveryAddress.complement }}
              </p>
              <p>
                {{ selectedSale.deliveryAddress.neighborhood }},
                {{ selectedSale.deliveryAddress.city }} -
                {{ selectedSale.deliveryAddress.state }}
              </p>
              <p>CEP: {{ selectedSale.deliveryAddress.zipCode }}</p>
            </div>

            <div class="items-list">
              <h4>Itens:</h4>
              <div
                v-for="item in selectedSale.items"
                :key="item.itemId"
                class="item-detail"
              >
                <img
                  :src="item.image || '/volleyball.png'"
                  alt="Item"
                  class="item-image"
                />
                <div class="item-info">
                  <p>
                    <strong>{{ item.itemName }}</strong>
                  </p>
                  <p v-if="item.selectedColor">Cor: {{ item.selectedColor }}</p>
                  <p v-if="item.selectedSize">
                    Tamanho: {{ item.selectedSize }}
                  </p>
                  <p>Quantidade: {{ item.quantity }}</p>
                  <p>Preço unitário: R$ {{ item.unitPrice.toFixed(2) }}</p>
                  <p>
                    <strong
                      >Subtotal: R$
                      {{ (item.unitPrice * item.quantity).toFixed(2) }}</strong
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "../../components/Header.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import SaleService, {
  Sale,
  SaleStatus,
  PaymentMethod,
} from "../../api/SaleService";
import { Json } from "../../utils/Json";
import { CSVAdapter } from "../../utils/CSV";
import UserService from "../../api/UserService";

const router = useRouter();

const sales = ref<Sale[]>([]);
const allSales = ref<Sale[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedSale = ref<Sale | null>(null);
const users = ref<Map<string, any>>(new Map());
const selectedMonth = ref<string>("");

const currentPage = ref(1);
const itemsPerPage = 10;

const availableMonths = computed(() => {
  const months = new Set<string>();
  allSales.value.forEach((sale) => {
    if (sale.createdAt) {
      const date = new Date(sale.createdAt);
      const month = date.getMonth() + 1;
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const monthYear = `${date.getFullYear()}-${monthStr}`;
      months.add(monthYear);
    }
  });

  return Array.from(months)
    .sort((a, b) => b.localeCompare(a))
    .map((monthYear) => {
      const [year, month] = monthYear.split("-");
      const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      return {
        value: monthYear,
        label: `${monthNames[parseInt(month) - 1]} ${year}`,
      };
    });
});

const statistics = computed(() => {
  const totalSales = sales.value.length;
  const totalRevenue = sales.value.reduce((sum, sale) => sum + sale.total, 0);

  return {
    totalSales,
    totalRevenue,
  };
});

const totalPages = computed(() => Math.ceil(sales.value.length / itemsPerPage));

const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sales.value.slice(start, end);
});

const fetchSales = async () => {
  try {
    loading.value = true;
    error.value = null;

    const salesData = await SaleService.getSales();
    allSales.value = salesData;
    sales.value = salesData;

    const uniqueUserIds = [...new Set(salesData.map((sale) => sale.userId))];
    for (const userId of uniqueUserIds) {
      if (!users.value.has(userId)) {
        try {
          const userResponse = await UserService.getUserById(userId);
          users.value.set(userId, userResponse.data);
        } catch (userErr) {
          console.error(`Erro ao carregar usuário ${userId}:`, userErr);
          users.value.set(userId, { email: "Usuário não encontrado" });
        }
      }
    }
  } catch (err) {
    console.error("Erro ao carregar vendas:", err);
    error.value = "Erro ao carregar relatório de vendas. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

const filterSalesByMonth = () => {
  if (!selectedMonth.value) {
    sales.value = allSales.value;
  } else {
    sales.value = allSales.value.filter((sale) => {
      if (!sale.createdAt) return false;
      const date = new Date(sale.createdAt);
      const month = date.getMonth() + 1;
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const saleMonthYear = `${date.getFullYear()}-${monthStr}`;
      return saleMonthYear === selectedMonth.value;
    });
  }

  currentPage.value = 1;
};

const getUserName = (userId: string): string => {
  const user = users.value.get(userId);
  return user ? user.email : "Carregando...";
};

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "Data não disponível";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return (
    dateObj.toLocaleDateString("pt-BR") +
    " " +
    dateObj.toLocaleTimeString("pt-BR")
  );
};

const getStatusText = (status: SaleStatus): string => {
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

const getStatusClass = (status: SaleStatus): string => {
  switch (status) {
    case SaleStatus.PENDING:
      return "status-pending";
    case SaleStatus.CONFIRMED:
      return "status-confirmed";
    case SaleStatus.SHIPPED:
      return "status-shipped";
    case SaleStatus.DELIVERED:
      return "status-delivered";
    case SaleStatus.CANCELLED:
      return "status-cancelled";
    default:
      return "";
  }
};

const getPaymentMethodText = (method: PaymentMethod): string => {
  switch (method) {
    case PaymentMethod.CREDIT_CARD:
      return "Cartão de Crédito";
    case PaymentMethod.DEBIT_CARD:
      return "Cartão de Débito";
    case PaymentMethod.PIX:
      return "PIX";
    case PaymentMethod.CASH:
      return "Dinheiro";
    default:
      return "Método desconhecido";
  }
};

const viewSaleDetails = (sale: Sale) => {
  selectedSale.value = sale;
};

const closeModal = () => {
  selectedSale.value = null;
};

const exportReportJson = () => {
  const filteredData = sales.value.map(sale => ({
    cliente: getUserName(sale.userId),
    data: formatDate(sale.createdAt),
    status: getStatusText(sale.status),
    metodoPagamento: getPaymentMethodText(sale.paymentMethod),
    itens: sale.items.map(item => ({
      nome: item.itemName,
      preco: item.unitPrice,
      quantidade: item.quantity,
      cor: item.selectedColor,
      tamanho: item.selectedSize
    })),
    subtotal: sale.subtotal,
    desconto: sale.discount,
    cupom: sale.couponCode,
    total: sale.total,
    endereco: sale.deliveryAddress ? {
      rua: sale.deliveryAddress.street,
      numero: sale.deliveryAddress.number,
      complemento: sale.deliveryAddress.complement,
      bairro: sale.deliveryAddress.neighborhood,
      cidade: sale.deliveryAddress.city,
      estado: sale.deliveryAddress.state,
      cep: sale.deliveryAddress.zipCode
    } : null,
  }));
  
  const json = new Json(filteredData);
  json.export("relatorio_vendas.json");
};

const exportReportCSV = () => {
  const csvData = sales.value.map(sale => ({
    Cliente: getUserName(sale.userId),
    Data: formatDate(sale.createdAt),
    Status: getStatusText(sale.status),
    "Método de Pagamento": getPaymentMethodText(sale.paymentMethod),
    "Quantidade de Itens": sale.items.length,
    "Nomes dos Itens": sale.items.map(item => item.itemName).join("; "),
    "Cores": sale.items.map(item => item.selectedColor).join("; "),
    "Tamanhos": sale.items.map(item => item.selectedSize).join("; "),
    Subtotal: sale.subtotal,
    Desconto: sale.discount,
    Cupom: sale.couponCode || "",
    Total: sale.total,
    "Endereço Completo": sale.deliveryAddress ? 
      `${sale.deliveryAddress.street}, ${sale.deliveryAddress.number}, ${sale.deliveryAddress.neighborhood}, ${sale.deliveryAddress.city} - ${sale.deliveryAddress.state}, CEP: ${sale.deliveryAddress.zipCode}` 
      : "",
  }));
  
  const csv = new CSVAdapter(csvData);
  csv.export("relatorio_vendas.csv");
};

onMounted(async () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    router.push("/loja");
    return;
  }

  await fetchSales();
});
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.report-header {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.report-header h1 {
  color: var(--vt-c-blue);
  margin: 0;
}

.month-filter {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.month-filter label {
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.month-filter select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  min-width: 150px;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: var(--vt-c-orange);
}

.export-btn {
  padding: 8px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background-color: var(--vt-c-green);
  color: white;
  border: black;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}

.export-btn:hover {
  background-color: var(--vt-c-green-dark);
}

.export-btn p {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: red;
}

.sales-table-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-responsive {
  overflow-x: auto;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.sales-table th,
.sales-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.sales-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}
.status-confirmed {
  background-color: #d1ecf1;
  color: #0c5460;
}
.status-shipped {
  background-color: #d4edda;
  color: #155724;
}
.status-delivered {
  background-color: #c3e6cb;
  color: #155724;
}
.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.view-btn {
  padding: 6px 12px;
  background-color: var(--vt-c-blue);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.view-btn:hover {
  background-color: var(--vt-c-blue-dark);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #666;
}

.sale-info,
.delivery-address {
  margin-bottom: 20px;
}

.items-list {
  margin-top: 20px;
}

.item-detail {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-info p {
  margin: 2px 0;
}

@media (max-width: 768px) {
  .report-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .header-stats {
    justify-content: center;
  }

  .sales-table {
    font-size: 14px;
  }
}
</style>
