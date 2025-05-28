<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/jogadores">Jogadores</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ isEditMode ? "Editar" : "Registrar" }}
          </li>
        </ol>
      </nav>
      <form class="w-100 mx-auto mt-1" @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-8">
            <div class="form-group mb-3">
              <label for="nome" class="form-label"
                >Nome <span class="required">*</span></label
              >
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Digite o nome do jogador"
                v-model="formData.name"
              />
              <small v-if="errors.name" class="text-danger">{{
                errors.name
              }}</small>
            </div>
          </div>
          <div class="col">
            <div class="form-group mb-3">
              <label for="idade" class="form-label"
                >Data de Nascimento <span class="required">*</span></label
              >
              <input
                type="date"
                id="age"
                class="form-control"
                v-model="formData.age"
              />
              <small v-if="errors.age" class="text-danger">{{
                errors.age
              }}</small>
            </div>
          </div>
          <div class="col">
            <div class="form-group mb-3">
              <label for="altura" class="form-label"
                >Altura (m)<span class="required">*</span></label
              >
              <input
                type="number"
                id="height"
                class="form-control"
                step="0.01"
                v-model="formData.height"
              />
              <small v-if="errors.height" class="text-danger">{{
                errors.height
              }}</small>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group mb-3">
              <label for="posicao-principal" class="form-label"
                >Posição <span class="required">*</span></label
              >
              <select
                class="form-control"
                id="main-position"
                v-model="formData.mainPosition"
              >
                <option value="" disabled selected>Selecione a posição</option>
                <option value="Opposite Hitter">Oposto</option>
                <option value="Middle Blocker">Central</option>
                <option value="Outside Hitter">Ponta</option>
                <option value="Setter">Levantador</option>
                <option value="Libero">Líbero</option>
                <option value="Server Specialist">Especialista em saque</option>
                <option value="Defense Specialist">
                  Especialista em defesa
                </option>
              </select>
              <small v-if="errors.mainPosition" class="text-danger">{{
                errors.mainPosition
              }}</small>
            </div>
          </div>
          <div class="col">
            <div class="form-group mb-3">
              <label for="segunda-posicao" class="form-label"
                >Segunda Posição</label
              >
              <select
                class="form-control"
                id="sub-position"
                v-model="formData.subPosition"
              >
                <option value="" disabled selected>Selecione a posição</option>
                <option value="" selected>Nenhum</option>
                <option value="Opposite Hitter">Oposto</option>
                <option value="Middle Blocker">Central</option>
                <option value="Outside Hitter">Ponta</option>
                <option value="Setter">Levantador</option>
                <option value="Libero">Líbero</option>
                <option value="Server Specialist">Especialista em saque</option>
                <option value="Defense Specialist">
                  Especialista em defesa
                </option>
              </select>
              <small v-if="errors.subPosition" class="text-danger">{{
                errors.subPosition
              }}</small>
            </div>
          </div>
        </div>
        <div class="form-group mb-3">
          <label for="image" class="form-label">Foto</label>
          <input
            type="file"
            id="image"
            class="form-control"
            @change="handleImageUpload"
          />
        </div>

        <button type="submit" class="btn btn-primary w-100" style="margin-bottom: 20px;">
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
import PlayerService from "@/api/PlayerService";
import { useRouter } from "vue-router";

const router = useRouter();

const route = useRoute();
const playerId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const isEditMode = !!playerId;

const formData = ref<{
  name: string;
  age: string | null;
  height: number | null;
  mainPosition: string;
  subPosition: string | null;
  image: File | null;
}>({
  name: "",
  age: null,
  height: null,
  mainPosition: "",
  subPosition: null,
  image: null,
});

const errors = ref({
  name: "",
  age: "",
  height: "",
  mainPosition: "",
  subPosition: "",
});

onMounted(async () => {
  if (isEditMode) {
    try {
      const response = await PlayerService.getPlayerById(playerId);
      formData.value = {
        ...response.data,
      };
      console.log(formData.value);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  }
});

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.image = target.files[0];
  }
};

const validateForm = () => {
  let isValid = true;

  errors.value = {
    name: "",
    age: "",
    height: "",
    mainPosition: "",
    subPosition: "",
  };

  if (!formData.value.name) {
    errors.value.name = "O nome é obrigatório.";
    isValid = false;
  }

  if (!formData.value.age) {
    errors.value.age = "A data de nascimento é obrigatória.";
    isValid = false;
  } else {
    const selectedDate = new Date(formData.value.age);
    const minDate = new Date("1900-01-01");
    const maxDate = new Date();

    if (selectedDate < minDate || selectedDate > maxDate) {
      errors.value.age =
        "A data de nascimento deve estar entre 1º de janeiro de 1900 e hoje.";
      isValid = false;
    }
  }

  if (!formData.value.height || formData.value.height < 0.50) {
    errors.value.height = "A altura deve ser maior que 0.49";
    isValid = false;
  }

  if (!formData.value.mainPosition) {
    errors.value.mainPosition = "A posição principal é obrigatória.";
    isValid = false;
  }

  if (!formData.value.subPosition) {
    formData.value.subPosition = null;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  const data = new FormData();
  data.append("name", formData.value.name);
  if (formData.value.age) {
    const ageDate = new Date(formData.value.age);
    data.append("age", ageDate.toISOString());
  } else {
    data.append("age", "");
  }
  data.append(
    "height",
    formData.value.height !== null ? formData.value.height.toString() : ""
  );
  data.append("mainPosition", formData.value.mainPosition);
  if (formData.value.subPosition) {
    data.append("subPosition", formData.value.subPosition);
  }
  if (formData.value.image) {
    data.append("image", formData.value.image);
  }

  try {
    if (isEditMode) {
      await PlayerService.updatePlayer(playerId, data);
      router.push("/jogadores");
    } else {
      await PlayerService.createPlayer(data);
      router.push("/jogadores");
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
