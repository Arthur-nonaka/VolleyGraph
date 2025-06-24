<template>
  <Header />
  <main>
    <section class="cupom-section">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/loja">Cupons</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Listar
          </li>
        </ol>
      </nav>
      <div class="cupom-table-wrapper">
        <table class="cupom-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Desconto (%)</th>
              <th>Validade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cupom in cupons" :key="cupom.id">
              <td>{{ cupom.name }}</td>
              <td>{{ cupom.discount }}</td>
              <td>{{ formatDate(cupom.expiry) }}</td>
              <td>
                <span :class="isExpired(cupom.expiry) ? 'cupom-expired' : 'cupom-valid'">
                  {{ isExpired(cupom.expiry) ? 'Expirado' : 'Válido' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Header from "@/components/Header.vue";
import CupomService from "@/api/CupomService";

const cupons = ref([
  { id: 1, name: "PROMO10", discount: 10, expiry: "2025-07-01" },
  { id: 2, name: "FIMDEANO", discount: 20, expiry: "2024-01-01" },
  { id: 3, name: "VIP30", discount: 30, expiry: "2026-12-31" },
]);

// onMounted(async () => {
//   const response = await CupomService.getAll();
//   cupons.value = response.data;
// });

function isExpired(dateStr: string) {
  return new Date(dateStr) < new Date();
}
function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}
</script>

<style scoped>
.cupom-section {
  color: black;
  min-height: 100vh;
  padding: 40px 0 60px 0;
}

.breadcrumb {
  background: transparent;
  margin-bottom: 2rem;
}
.breadcrumb-item.active {
  color: var(--vt-c-blue);
  font-weight: bold;
}
.breadcrumb-item a {
  color: var(--vt-c-blue);
  text-decoration: underline;
}

.cupom-table-wrapper {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px 20px 20px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.cupom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 1.1em;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}
.cupom-table th {
  background: var(--vt-c-blue);
  color: #fff;
  font-weight: bold;
  padding: 16px 8px;
  border: none;
}
.cupom-table td {
  padding: 14px 8px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}
.cupom-table tr:last-child td {
  border-bottom: none;
}
.cupom-expired {
  color: #d32f2f;
  font-weight: bold;
  background: #ffeaea;
  border-radius: 8px;
  padding: 4px 12px;
}
.cupom-valid {
  color: #388e3c;
  font-weight: bold;
  background: #eaffea;
  border-radius: 8px;
  padding: 4px 12px;
}
</style>