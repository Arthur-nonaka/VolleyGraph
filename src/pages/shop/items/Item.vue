<template>
  <Header />
  <main>
    <section class="container" style="background-color: white; padding: 10px">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">
            <router-link to="/loja">Itens</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Código {{ item?._id }}
          </li>
        </ol>
      </nav>
      <div class="main">
        <h1>{{ item?.name }}</h1>
        <div v-if="loading">Carregando...</div>
        <div v-else-if="error">{{ error }}</div>
        <div class="item-details">
          <div
            class="image-container"
            @mousemove="moveLens"
            @mouseleave="hideLens"
            @mouseenter="showLens"
            ref="imageContainer"
          >
            <img
              :src="item?.image ? item.image : '/null.jpg'"
              alt="Item Image"
              ref="mainImage"
            />
            <div v-if="lensVisible" class="lens" :style="lensStyle"></div>
          </div>
          <div class="item-info">
            <div style="height: 33%">
              <p
                style="
                  color: var(--vt-c-orange);
                  font-weight: 700;
                  font-size: 35px;
                  margin-bottom: 0;
                "
              >
                R$ {{ item?.price }}
              </p>
              <div>
                <div
                  style="
                    color: #777;
                    font-size: 18px;
                    display: flex;
                    flex-direction: column;
                  "
                >
                  <span v-if="item?.brand">Marca {{ item?.brand }}</span>
                  <span v-if="item?.weight">Peso {{ item?.weight }} g</span>
                  <span v-if="item?.sport">Esporte {{ item?.sport }}</span>
                  <span v-if="item?.category"
                    >Categoria {{ item?.category }}</span
                  >
                  <span v-if="item?.material">Tecido {{ item?.material }}</span>
                </div>
                <p style="color: black">{{ item?.description }}</p>
              </div>
            </div>
            <div
              style="
                width: 100%;
                display: flex;
                justify-content: center;
                flex-direction: column;
                padding-bottom: 2.5%;
              "
            >
              <div v-if="item?.quantity">
                <div>
                  <p style="color: #777; font-size: 18px">
                    Quantidade disponível:
                    <span>
                      {{ item?.quantity > 0 ? item?.quantity : "Indisponível" }}
                    </span>
                  </p>
                </div>
                <div style="margin: 10px">
                  Quantidade:
                  <span>
                    <input
                      class="input"
                      type="number"
                      :min="1"
                      :max="item?.quantity"
                      v-model="quantity"
                    />
                  </span>
                </div>
              </div>
              <div v-else>
                <div v-if="allVariations.length">
                  <label>Cores:</label>
                  <div style="display: flex; gap: 8px; flex-wrap: wrap">
                    <button
                      v-for="color in [
                        ...new Set(allVariations.map((v) => v.color)),
                      ]"
                      :key="color"
                      :class="{ selected: color === selectedColor }"
                      @click="
                        selectedColor = color;
                        selectedSize = null;
                      "
                      style="margin-right: 8px"
                      type="button"
                      class="colors"
                    >
                      {{ color }}
                    </button>
                  </div>
                </div>

                <label>Tamanhos:</label>
                <div style="display: flex; gap: 8px; flex-wrap: wrap">
                  <button
                    v-for="size in [
                      ...new Set(
                        allVariations
                          .filter((v) => v.color === selectedColor)
                          .map((v) => v.size)
                      ),
                    ]"
                    :key="String(size)"
                    :class="{ selected: size === selectedSize }"
                    @click="selectedSize = String(size)"
                    :disabled="
                      allVariations.find(
                        (v) => v.color === selectedColor && v.size === size
                      )?.quantity === 0
                    "
                    type="button"
                    class="colors"
                  >
                    {{ size }}
                    <span
                      v-if="
                        allVariations.find(
                          (v) => v.color === selectedColor && v.size === size
                        )?.quantity === 0
                      "
                    >
                    </span>
                  </button>
                </div>
                <div>
                  <div>
                    <p style="color: #777; font-size: 18px">
                      Quantidade disponível:
                      <span v-if="selectedColor && selectedSize">
                        {{
                          allVariations.find(
                            (v) =>
                              v.color === selectedColor &&
                              v.size === selectedSize
                          )?.quantity ?? 0
                        }}
                      </span>
                    </p>
                  </div>
                  <div style="margin: 10px">
                    Quantidade:
                    <span v-if="selectedColor && selectedSize">
                      <input
                        class="input"
                        type="number"
                        :min="1"
                        :max="
                          allVariations.find(
                            (v) =>
                              v.color === selectedColor &&
                              v.size === selectedSize
                          )?.quantity ?? 0
                        "
                        v-model="quantity"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <button
                class="button"
                :disabled="
                  ((!selectedColor || !selectedSize) && !item?.quantity) ||
                  cartLoading
                "
                @click="handleAddToCart"
              >
                <img class="img" src="/carrinho.png" />
                <span style="font-weight: 700">
                  {{ cartLoading ? "Adicionando..." : "Comprar" }}
                </span>
              </button>

              <div v-if="cartError" class="error-message">
                {{ cartError }}
              </div>

              <div v-if="loginWarning" class="warning-message">
                {{ loginWarning }}
              </div>

              <div v-if="successMessage" class="success-message">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import ItemService from "@/api/ItemService";
import { useCart } from "@/composables/useCart";

const route = useRoute();
const item = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const quantity = ref(1);
const successMessage = ref("");
const loginWarning = ref("");

const userId = ref(localStorage.getItem("userId"));

const {
  cart,
  loading: cartLoading,
  error: cartError,
  addItem,
} = useCart(userId.value || "");

const lensVisible = ref(false);
const lensStyle = ref({});
const imageContainer = ref<HTMLElement | null>(null);
const mainImage = ref<HTMLImageElement | null>(null);
const selectedColor = ref<string | null>(null);
const selectedSize = ref<string | null>(null);

const allVariations = computed(() => {
  if (!item.value?.variations) return [];
  const colors = [
    ...new Set(item.value.variations.map((v: any) => v.colorName)),
  ];
  const sizes = [...new Set(item.value.variations.map((v: any) => v.size))];
  return colors
    .map((color: any) =>
      sizes.map((size) => {
        const found = item.value.variations.find(
          (v: any) => v.colorName === color && v.size === size
        );
        return {
          color,
          size,
          quantity: found ? found.quantity : 0,
        };
      })
    )
    .reduce((acc, val) => acc.concat(val), []);
});

// Função para adicionar ao carrinho
const handleAddToCart = async () => {
  if (!item.value) return;

  // Verificar se o usuário está logado
  if (!userId.value) {
    loginWarning.value =
      "Você precisa fazer login para adicionar itens ao carrinho.";

    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      loginWarning.value = "";
    }, 5000);
    return;
  }

  try {
    successMessage.value = "";
    loginWarning.value = "";

    await addItem({
      itemId: item.value._id,
      quantity: quantity.value,
      selectedColor: selectedColor.value || undefined,
      selectedSize: selectedSize.value || undefined,
    });

    successMessage.value = "Produto adicionado ao carrinho com sucesso!";

    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
  }
};

const lensSize = 200;
const zoom = 2;

const moveLens = (e: MouseEvent) => {
  if (!imageContainer.value || !mainImage.value) return;
  const rect = imageContainer.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const minX = lensSize / 2;
  const minY = lensSize / 2;
  const maxX = rect.width - lensSize / 2;
  const maxY = rect.height - lensSize / 2;

  const lensX = Math.max(minX, Math.min(x, maxX));
  const lensY = Math.max(minY, Math.min(y, maxY));

  lensStyle.value = {
    left: `${lensX - lensSize / 2}px`,
    top: `${lensY - lensSize / 2}px`,
    width: `${lensSize}px`,
    height: `${lensSize}px`,
    backgroundImage: `url('${mainImage.value.src}')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${rect.width * zoom}px ${rect.height * zoom}px`,
    backgroundPosition: `-${lensX * zoom - lensSize / 2}px -${
      lensY * zoom - lensSize / 2
    }px`,
    display: "block",
  };
};

const showLens = () => {
  lensVisible.value = true;
};

const hideLens = () => {
  lensVisible.value = false;
};

const fetchItem = async () => {
  try {
    const id = route.params.id as string;
    const response = await ItemService.getItemById(id);
    item.value = response.data;
  } catch (err) {
    error.value = "Erro ao carregar informações do jogador.";
  } finally {
    loading.value = false;
  }

  console.log(item.value);
};

onMounted(fetchItem);

watch([quantity, selectedColor, selectedSize], () => {
  const variation = allVariations.value.find(
    (v) => v.color === selectedColor.value && v.size === selectedSize.value
  );
  if (variation) {
    if (quantity.value > variation.quantity) {
      quantity.value = variation.quantity;
    }
    if (quantity.value < 1) {
      quantity.value = 1;
    }
  }
});
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.item-details {
  width: 100%;
  height: 64vh;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.image-container {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.image-container img {
  width: 90%;
  height: 90%;
  object-fit: contain;
  display: block;
}

.lens {
  position: absolute;
  pointer-events: none;
  border: 2px solid #aaa;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.1);
  background-clip: padding-box;
}

.item-info {
  width: 50%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

p {
  margin: 10px 0;
}

.button {
  background-color: var(--vt-c-orange);
  color: white;
  border: none;
  padding: 5px 20px;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
  background-color: var(--vt-c-orange-dark);
}

.img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  text-decoration: line-through;
}

.colors {
  background-color: white;
  color: black;
  height: 5vh;
  padding: 5px 10px;
  min-width: 45px;
  min-height: 40px;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: inset 0 0 2px 1px rgba(145, 134, 134, 0.377);
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}

.colors:hover {
  box-shadow: inset 0 0 2px 1px var(--vt-c-orange);
  box-sizing: border-box;
}

.colors.selected {
  background-color: var(--vt-c-orange);
  border: 2px solid var(--vt-c-orange-dark);
  color: white;
  box-sizing: border-box;
}

.input {
  width: 60px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  font-size: 20px;
  margin-left: 10px;
}

.error-message {
  margin-top: 10px;
  padding: 8px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 14px;
}

.warning-message {
  margin-top: 10px;
  padding: 8px;
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  font-size: 14px;
}

.success-message {
  margin-top: 10px;
  padding: 8px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  font-size: 14px;
}
</style>
