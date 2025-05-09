<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/times">Times</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ isEditMode ? "Editar" : "Registrar" }}
          </li>
        </ol>
      </nav>
      <form class="w-100 mx-auto mt-1" @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="nome" class="form-label"
                >Nome <span class="required">*</span></label
              >
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Digite o nome do time"
                v-model="formData.name"
              />
              <small v-if="errors.name" class="text-danger">{{
                errors.name
              }}</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group mb-3">
              <label for="state" class="form-label"
                >Estado <span class="required">*</span></label
              >
              <select
                id="state"
                class="form-control"
                v-model="selectedState"
                @change="loadCities"
              >
                <option value="" disabled>Selecione um estado</option>
                <option
                  v-for="state in states"
                  :key="state.id"
                  :value="state.sigla"
                >
                  {{ state.sigla }}
                </option>
              </select>
              <small v-if="errors.state" class="text-danger">{{
                errors.state
              }}</small>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-group mb-3">
              <label for="city" class="form-label"
                >Cidade <span class="required">*</span></label
              >
              <select
                id="city"
                class="form-control"
                v-model="formData.address"
                :disabled="!cities.length"
              >
                <option value="" disabled>Selecione uma cidade</option>
                <option
                  v-for="city in cities"
                  :key="city.id"
                  :value="city.nome"
                >
                  {{ city.nome }}
                </option>
              </select>
              <small v-if="errors.address" class="text-danger">{{
                errors.address
              }}</small>
            </div>
          </div>
        </div>
        <div class="form-group mb-3">
          <label for="image" class="form-label">Logo</label>
          <input
            type="file"
            id="image"
            class="form-control"
            @change="handleImageUpload"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100"
          style="margin-bottom: 20px"
        >
          {{ isEditMode ? "Atualizar" : "Registrar" }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import TeamService from "@/api/TeamService";
import axios from "axios";

const route = useRoute();
const teamId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const isEditMode = !!teamId;

const states = ref([]);
const cities = ref([]);
const selectedState = ref("");
const selectedCity = ref("");

const loadStates = async () => {
  try {
    const response = await axios.get("https://brasilapi.com.br/api/ibge/uf/v1");
    states.value = response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
  }
};

const loadCities = async () => {
  if (!selectedState.value) {
    cities.value = [];
    return;
  }

  try {
    const response = await axios.get(
      `https://brasilapi.com.br/api/ibge/municipios/v1/${selectedState.value}`
    );
    cities.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar cidades:", error);
  }
};

const formData = ref<{
  name: string;
  address: string;
  logo: File | null;
}>({
  name: "",
  address: "",
  logo: null,
});

const errors = ref({
  name: "",
  address: "",
});

onMounted(async () => {
  if (isEditMode) {
    try {
      const response = await TeamService.getTeamById(teamId);
      formData.value = {
        ...response.data,
      };
      console.log(formData.value);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  }

  loadStates();
});

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.logo = target.files[0];
  }
};

const validateForm = () => {
  let isValid = true;

  errors.value = {
    name: "",
    address: "",
  };

  if (!formData.value.name) {
    errors.value.name = "O nome é obrigatório.";
    isValid = false;
  }

  if (!formData.value.address) {
    errors.value.address = "A cidade é obrigatório.";
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  const data = new FormData();
  data.append("name", formData.value.name);
  data.append("address", formData.value.address);
  if (formData.value.logo) {
    data.append("image", formData.value.logo);
  }

  try {
    if (isEditMode) {
      await TeamService.updateTeam(teamId, data);
    } else {
      await TeamService.createTeam(data);
    }
  } catch (error: any) {
    if (error.response.status === 400) {
      const validationErrors = error.response.data;
      validationErrors.forEach(
        (err: {
          property: keyof typeof errors.value;
          constraints: Record<string, string>;
        }) => {
          errors.value[err.property] = Object.values(err.constraints).join(
            ", "
          );
        }
      );
      console.log(errors.value);
    } else {
      console.error("Error creating player:", error);
    }
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

select:hover {
  cursor: pointer;
}
</style>
