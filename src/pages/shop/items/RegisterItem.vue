<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/loja">Itens</router-link>
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
              <label for="name" class="form-label"
                >Nome <span class="required">*</span></label
              >
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Digite o nome do item"
                v-model="formData.name"
              />
              <small v-if="errors.name" class="text-danger">{{
                errors.name
              }}</small>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="brand" class="form-label"
                >Marca <span class="required">*</span></label
              >
              <input
                type="text"
                id="brand"
                class="form-control"
                placeholder="Digite a marca do item"
                v-model="formData.brand"
              />
              <small v-if="errors.brand" class="text-danger">{{
                errors.brand
              }}</small>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="price" class="form-label"
                >Preço <span class="required">*</span></label
              >
              <input
                type="number"
                id="price"
                class="form-control"
                step="0.01"
                placeholder="Digite o preço do item"
                v-model="formData.price"
              />
              <small v-if="errors.price" class="text-danger">{{
                errors.price
              }}</small>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="amount" class="form-label"
                >Quantidade <span class="required">*</span></label
              >
              <input
                type="number"
                id="amount"
                class="form-control"
                placeholder="Digite a quantidade do item"
                v-model="formData.amount"
              />
              <small v-if="errors.amount" class="text-danger">{{
                errors.amount
              }}</small>
            </div>
          </div>
        </div>
        <div class="form-group mb-3">
          <label for="type" class="form-label"
            >Tipo <span class="required">*</span></label
          >
          <select class="form-control" id="type" v-model="formData.type">
            <option value="" disabled selected>Selecione o tipo do item</option>
            <option value="clothes">Roupas</option>
            <option value="tennis">Tênis</option>
            <option value="ball">Bola</option>
          </select>
          <small v-if="errors.type" class="text-danger">{{
            errors.type
          }}</small>
        </div>
        <div class="form-group mb-3">
          <label for="description" class="form-label">Descrição</label>
          <textarea
            id="description"
            class="form-control"
            placeholder="Digite a descrição do item"
            v-model="formData.description"
          ></textarea>
        </div>
        <div class="form-group mb-3">
          <label for="image" class="form-label">Imagem</label>
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
import ItemService from "@/api/ItemService";

const route = useRoute();
const itemId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const isEditMode = !!itemId;

const formData = ref<{
  name: string;
  description: string | null;
  price: number | null;
  amount: number | null;
  brand: string;
  type: string;
  image: File | null;
}>({
  name: "",
  description: null,
  price: null,
  amount: null,
  brand: "",
  type: "",
  image: null,
});

const errors = ref({
  name: "",
  description: "",
  price: "",
  amount: "",
  brand: "",
  type: "",
});

onMounted(async () => {
  if (isEditMode) {
    try {
      const response = await ItemService.getItemById(itemId);
      formData.value = {
        ...response.data,
      };
    } catch (error) {
      console.error("Erro ao buscar os dados do item:", error);
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
    description: "",
    price: "",
    amount: "",
    brand: "",
    type: "",
  };

  if (!formData.value.name) {
    errors.value.name = "O nome é obrigatório.";
    isValid = false;
  }

  if (!formData.value.brand) {
    errors.value.brand = "A marca é obrigatória.";
    isValid = false;
  }

  if (!formData.value.price || formData.value.price <= 0) {
    errors.value.price = "O preço deve ser maior que 0.";
    isValid = false;
  }

  if (!formData.value.amount || formData.value.amount <= 0) {
    errors.value.amount = "A quantidade deve ser maior que 0.";
    isValid = false;
  }

  if (!formData.value.type) {
    errors.value.type = "O tipo é obrigatório.";
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

//   const data = new FormData();
//   data.append("name", formData.value.name);
//   data.append("brand", formData.value.brand);
//   data.append("price", formData.value.price?.toString() || "");
//   data.append("amount", formData.value.amount?.toString() || "");
//   data.append("type", formData.value.type);
//   if (formData.value.description) {
//     data.append("description", formData.value.description);
//   }
//   if (formData.value.image) {
//     data.append("image", formData.value.image);
//   }

  const data = {
    type: formData.value.type,
    baseAttributes: {
      name: formData.value.name,
      brand: formData.value.brand,
      description: formData.value.description,
      price: formData.value.price,
      amount: formData.value.amount,
    },
    specificAttributes: {
    },
  };

  const formDataToSend = new FormData();
  formDataToSend.append("type", data.type);
  formDataToSend.append("baseAttributes", JSON.stringify(data.baseAttributes));
  formDataToSend.append(
    "specificAttributes",
    JSON.stringify(data.specificAttributes)
  );
  if (formData.value.image) {
    formDataToSend.append("image", formData.value.image);
  }

  try {
    if (isEditMode) {
      await ItemService.updateItem(itemId, formDataToSend);
    } else {
      await ItemService.createItem(formDataToSend);
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
    } else {
      console.error("Erro ao criar/atualizar o item:", error);
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
