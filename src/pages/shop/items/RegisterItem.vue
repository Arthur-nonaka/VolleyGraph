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
              <label for="description" class="form-label">Descrição</label>
              <textarea
                id="description"
                class="form-control"
                placeholder="Digite a descrição do item"
                v-model="formData.description"
              ></textarea>
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
          <label for="image" class="form-label">Imagem</label>
          <input
            type="file"
            id="image"
            class="form-control"
            @change="handleImageUpload"
          />
        </div>

        <div v-if="formData.type === 'ball'" class="form-group mb-3">
          <label for="sport" class="form-label">Esporte</label>
          <input
            type="text"
            id="color"
            class="form-control"
            placeholder="Digite a cor"
            v-model="specificAttributes.sport"
          />
          <small v-if="errors.sport" class="text-danger">{{
            errors.sport
          }}</small>
          <label for="weight" class="form-label">Peso</label>
          <input
            type="number"
            step="0.01"
            id="weight"
            class="form-control"
            placeholder="Digite o peso (kg)"
            v-model="specificAttributes.weight"
          />
          <small v-if="errors.weight" class="text-danger">{{
            errors.weight
          }}</small>
        </div>

        <div v-if="formData.type === 'clothes'" class="form-group mb-3">
          <label for="color" class="form-label">Cores disponíveis</label>
          <input
            type="text"
            id="color"
            class="form-control"
            placeholder="Digite a cor"
            v-model="specificAttributes.color"
          />
          <small v-if="errors.colors" class="text-danger">{{
            errors.colors
          }}</small>
          <label for="sizes" class="form-label">Tamanhos Disponíveis</label>
          <div
            id="sizes"
            class="form-check"
            v-for="size in availableSizes.clothes"
            :key="size"
          >
            <input
              type="checkbox"
              class="form-check-input"
              :id="`size-${size}`"
              :value="size"
              v-model="specificAttributes.sizes"
            />
            <label class="form-check-label" :for="`size-${size}`">{{
              size
            }}</label>
            <small v-if="errors.sizes" class="text-danger">{{
              errors.sizes
            }}</small>
          </div>
          <label for="category" class="form-label">Categoria</label>
          <select
            id="category"
            class="form-control"
            v-model="specificAttributes.category"
          >
            <option value="" disabled>Selecione a categoria</option>
            <option value="Shirt">Camisa</option>
            <option value="Pants">Calça</option>
            <option value="Socks">Meias</option>
            <option value="Accessories">Acessórios</option>
          </select>
          <small v-if="errors.category" class="text-danger">{{
            errors.category
          }}</small>
        </div>

        <div v-if="formData.type === 'tennis'" class="form-group mb-3">
          <label for="color" class="form-label">Cor</label>
          <input
            type="text"
            id="color"
            class="form-control"
            placeholder="Digite a cor"
            v-model="specificAttributes.color"
          />
          <small v-if="errors.colors" class="text-danger">{{
            errors.colors
          }}</small>
          <label for="sizes" class="form-label">Tamanhos Disponíveis</label>
          <div
            id="sizes"
            class="form-check"
            v-for="size in availableSizes.tennis"
            :key="size"
          >
            <input
              type="checkbox"
              class="form-check-input"
              :id="`size-${size}`"
              :value="size"
              v-model="specificAttributes.sizes"
            />
            <label class="form-check-label" :for="`size-${size}`">{{
              size
            }}</label>
            <small v-if="errors.sizes" class="text-danger">{{
              errors.sizes
            }}</small>
          </div>
        </div>
        <div>
          <Variations
            :variations="variations"
            @update:variations="updateVariations"
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
import Variations from "@/components/Variations.vue";
import ItemService from "@/api/ItemService";
import { useRouter } from "vue-router";

const router = useRouter();
const variations = ref([
  {
    color: "#FFFFFF",
    colorName: "Branco",
    sizes: [],
  },
]);

const route = useRoute();
const itemId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const isEditMode = !!itemId;

const availableSizes = {
  clothes: ["PP", "P", "M", "G", "GG"],
  tennis: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
};

const specificAttributes = ref<{
  sport?: string;
  weight?: number | null;
  color?: string;
  sizes?: (string | number)[];
  category?: string;
}>({});

const formData = ref<{
  name: string;
  description: string | null;
  price: number | null;
  brand: string;
  type: string;
  image: File | null;
}>({
  name: "",
  description: null,
  price: null,
  brand: "",
  type: "",
  image: null,
});

const errors = ref({
  name: "",
  description: "",
  price: "",
  brand: "",
  type: "",
  colors: "",
  sizes: "",
  category: "",
  sport: "",
  weight: "",
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

const updateVariations = (newVariations: any) => {
  variations.value = newVariations;
};

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
    brand: "",
    type: "",
    colors: "",
    sizes: "",
    category: "",
    sport: "",
    weight: "",
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

  if (!formData.value.type) {
    errors.value.type = "O tipo é obrigatório.";
    isValid = false;
  }

  if (formData.value.type === "clothes") {
    if (!specificAttributes.value.color) {
      errors.value.colors = "Selecione ao menos uma cor.";
      isValid = false;
    }
    if (
      !specificAttributes.value.sizes ||
      specificAttributes.value.sizes.length === 0
    ) {
      errors.value.sizes = "Selecione ao menos um tamanho.";
      isValid = false;
    }
    if (!specificAttributes.value.category) {
      errors.value.category = "A categoria é obrigatória.";
      isValid = false;
    }
  }

  if (formData.value.type === "tennis") {
    if (!specificAttributes.value.color) {
      errors.value.colors = "Selecione ao menos uma cor.";
      isValid = false;
    }
    if (
      !specificAttributes.value.sizes ||
      specificAttributes.value.sizes.length === 0
    ) {
      errors.value.sizes = "Selecione ao menos um tamanho.";
      isValid = false;
    }
  }

  if (formData.value.type === "ball") {
    if (!specificAttributes.value.sport) {
      errors.value.sport = "O esporte é obrigatório.";
      isValid = false;
    }
    if (
      specificAttributes.value.weight === undefined ||
      specificAttributes.value.weight === null ||
      specificAttributes.value.weight <= 0
    ) {
      errors.value.weight = "O peso deve ser maior que 0.";
      isValid = false;
    }
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
    },
    specificAttributes: specificAttributes.value,
    variations: variations.value,
  };

  const formDataToSend = new FormData();
  formDataToSend.append("type", data.type);
  formDataToSend.append("baseAttributes", JSON.stringify(data.baseAttributes));
  formDataToSend.append(
    "specificAttributes",
    JSON.stringify(data.specificAttributes)
  );
  formDataToSend.append("variations", JSON.stringify(data.variations));
  if (formData.value.image) {
    formDataToSend.append("image", formData.value.image);
  }

  try {
    if (isEditMode) {
      await ItemService.updateItem(itemId, formDataToSend);
      router.push("/loja");
    } else {
      await ItemService.createItem(formDataToSend);
      router.push("/loja");
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
