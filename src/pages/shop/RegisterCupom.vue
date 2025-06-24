<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/loja/cupom/mostrar">Cupons</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Registrar
          </li>
        </ol>
      </nav>
      <form class="w-100 mx-auto mt-1" @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group mb-3">
              <label
                for="name"
                class="form-label"
                >Nome do Cupom <span class="required">*</span
              ></label>
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Digite o nome do cupom"
                v-model="formData.name"
                required
              />
              <small
                v-if="error && !formData.name"
                class="text-danger"
              >{{ error }}</small
              >
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group mb-3">
              <label
                for="discount"
                class="form-label"
                >% de Desconto <span class="required">*</span
              ></label>
              <input
                type="number"
                id="discount"
                class="form-control"
                placeholder="Digite o desconto (%)"
                v-model.number="formData.discount"
                min="1"
                max="100"
                required
              />
              <small
                v-if="error && (formData.discount < 1 || formData.discount > 100)"
                class="text-danger"
              >{{ error }}</small
              >
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group mb-3">
              <label
                for="expiry"
                class="form-label"
                >Data de Validade </label>
              <input
                type="date"
                id="expiry"
                class="form-control"
                v-model="formData.expirationDate"
              />
              <small
                v-if="error && !formData.expirationDate"
                class="text-danger"
              >{{ error }}</small
              >
            </div>
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100"
          style="margin-bottom: 20px"
        >
          Cadastrar Cupom
        </button>
        <div class="text-success" v-if="success">{{ success }}</div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import CupomService from "@/api/CupomService";

const route = useRoute();
const router = useRouter();
const isEditMode = route.name === 'EditarCupom' || route.path.includes('/editar/');

const formData = ref({
  name: "",
  discount: 10,
  expirationDate: "",
});

const error = ref("");
const success = ref("");

onMounted(async () => {
  if (isEditMode && route.params.id) {
    try {
      const response = await CupomService.getCupomById(route.params.id as string);
      const cupom = response.data;
      formData.value = {
        name: cupom.name || "",
        discount: cupom.discount || 10,
        expirationDate: cupom.expirationDate ? new Date(cupom.expirationDate).toISOString().slice(0, 10) : "",
      };
    } catch (e) {
      error.value = "Erro ao carregar cupom para edição.";
    }
  }
});

const submitForm = async () => {
  error.value = "";
  if (!formData.value.name || !formData.value.discount) {
    error.value = "Preencha todos os campos.";
    return;
  }
  if (formData.value.discount < 1 || formData.value.discount > 100) {
    error.value = "O desconto deve ser entre 1% e 100%.";
    return;
  }
  if (isEditMode && route.params.id) {
    // Corrige: envia a data no formato YYYY-MM-DD para o backend, mas converte para Date antes de enviar
    const payload = {
      ...formData.value,
      expirationDate: formData.value.expirationDate
        ? (() => {
            const [year, month, day] = formData.value.expirationDate.split('-');
            return new Date(Number(year), Number(month) - 1, Number(day));
          })()
        : null,
    };
    await CupomService.updateCupom(route.params.id as string, payload)
      .then(() => {
        success.value = "Cupom atualizado com sucesso!";
        setTimeout(() => router.push('/loja/cupom/mostrar'), 1200);
      })
      .catch(() => {
        error.value = "Erro ao atualizar cupom.";
      });
  } else {
    await CupomService.createCupom(formData.value)
      .then(() => {
        success.value = "Cupom cadastrado com sucesso!";
        formData.value = { name: "", discount: 10, expirationDate: "" };
      })
      .catch(() => {
        error.value = "Erro ao cadastrar cupom.";
      });
  }
};
</script>

<style scoped>
.container {
  color: black;
}

form {
  padding-right: 1rem;
  padding-left: 1rem;
}

select:hover,
input:hover {
  cursor: pointer;
}

.text-danger {
  color: #d32f2f;
  margin-top: 10px;
}
.text-success {
  color: #388e3c;
  margin-top: 10px;
}
</style>