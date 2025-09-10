<template>
  <div>
    <button @click="handleClick" class="cart-button">
      <img src="/carrinho.png" />
      <span v-if="cart && cart.items && cart.items.length" class="cart-badge">
        {{ totalItems }}
      </span>
    </button>
  </div>
  <transition name="fade">
    <div v-if="show" class="cart">
      <div class="cart-header">
        <h2>Seu Carrinho</h2>
        <button class="close-btn" @click="show = false">&times;</button>
      </div>

      <div v-if="loading" class="cart-loading">
        <p>Carregando...</p>
      </div>

      <div v-else-if="error" class="cart-error">
        <p>{{ error }}</p>
        <button @click="fetchCart" class="retry-btn">Tentar novamente</button>
      </div>

      <div
        v-else-if="!cart || !cart.items || cart.items.length === 0"
        class="cart-empty"
      >
        <p>Seu carrinho está vazio.</p>
      </div>

      <div v-else class="cart-items-container">
        <div
          v-for="item in cartItemsWithDetails"
          :key="`${item.itemId}-${item.selectedColor}-${item.selectedSize}`"
          class="cart-item"
        >
          <img
            :src="item.productDetails?.image || '/null.jpg'"
            class="cart-item-img"
          />
          <div class="cart-item-info">
            <div class="cart-item-title">
              {{ item.productDetails?.name || "Produto" }}
            </div>
            <div class="cart-item-details">
              <span v-if="item.selectedColor">
                Cor: <b>{{ item.selectedColor }}</b>
              </span>
              <span v-if="item.selectedSize">
                Tamanho: <b>{{ item.selectedSize }}</b>
              </span>
            </div>
            <div class="cart-item-qty">
              <button @click="decreaseQuantity(item)" class="qty-btn">-</button>
              <span
                >Quantidade: <b>{{ item.quantity }}</b></span
              >
              <button @click="increaseQuantity(item)" class="qty-btn">+</button>
            </div>
            <div class="cart-item-price" v-if="item.productDetails?.price">
              R$ {{ (item.productDetails.price * item.quantity).toFixed(2) }}
            </div>
          </div>
          <button class="remove-btn" @click="removeItem(item)" title="Remover">
            &times;
          </button>
        </div>
      </div>

      <div class="cart-coupon">
        <input
          v-model="cupom"
          type="text"
          placeholder="Cupom de desconto"
          class="coupon-input"
        />
        <button class="apply-coupon-btn" @click="applyCupom">Aplicar</button>
      </div>

      <span v-if="cupomError !== ''" class="error-message">
        {{ cupomError }}
      </span>

      <div v-if="cartItemsWithDetails.length > 0">
        <div v-if="discount === 0" class="cart-total">
          <span>Total:</span>
          <span class="cart-total-price"> R$ {{ totalPrice.toFixed(2) }} </span>
        </div>
        <div v-else>
          <div class="cart-total">
            <span>Desconto:</span>
            <span style="color: green">
              R$ {{ ((totalPrice * discount) / 100).toFixed(2) }}
            </span>
          </div>
          <div class="cart-total">
            <span>Total:</span>
            <span class="cart-total-price">
              R$ {{ (totalPrice - (totalPrice * discount) / 100).toFixed(2) }}
            </span>
          </div>
        </div>
        <button class="checkout-btn" @click="checkout">Finalizar Compra</button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCart } from "@/composables/useCart";
import CupomService from "@/api/CupomService";
import ItemService from "@/api/ItemService";

const userId = ref(localStorage.getItem("userId") || "");

const show = ref(false);
const cupom = ref("");
const discount = ref(0);
const cupomError = ref("");
const productDetails = ref<Record<string, any>>({});

const {
  cart,
  loading,
  error,
  fetchCart,
  addItem,
  removeItem: removeItemFromCart,
  updateQuantity,
  clearCart,
} = useCart(userId.value);

interface CartItem {
  itemId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  productDetails?: any;
}

// Interface para o carrinho
interface Cart {
  items: CartItem[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Buscar detalhes dos produtos quando o carrinho mudar
const cartItemsWithDetails = computed(() => {
  if (!cart.value || !(cart.value as Cart).items) return [];

  return (cart.value as Cart).items.map((item: CartItem) => ({
    ...item,
    productDetails: productDetails.value[item.itemId],
  }));
});

// Calcular total de itens
const totalItems = computed(() => {
  if (!cart.value || !(cart.value as Cart).items) return 0;
  return (cart.value as Cart).items.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0
  );
});

// Calcular preço total
const totalPrice = computed(() => {
  return cartItemsWithDetails.value.reduce((sum: number, item: any) => {
    const price = item.productDetails?.price || 0;
    return sum + price * item.quantity;
  }, 0);
});

// Buscar detalhes dos produtos
const fetchProductDetails = async () => {
  if (!cart.value || !(cart.value as Cart).items) return;

  for (const item of (cart.value as Cart).items) {
    if (!productDetails.value[item.itemId]) {
      try {
        const response = await ItemService.getItemById(item.itemId);
        productDetails.value[item.itemId] = response.data;
      } catch (error) {
        console.error(`Erro ao buscar produto ${item.itemId}:`, error);
        productDetails.value[item.itemId] = {
          name: "Produto não encontrado",
          price: 0,
          image: null,
        };
      }
    }
  }
};

// Aplicar cupom
async function applyCupom() {
  if (!cupom.value) {
    return;
  }

  cupomError.value = "";

  try {
    const response = await CupomService.validateCupom(cupom.value);
    if (response.data.success) {
      cupom.value = "";
      discount.value = response.data.discount;
    } else {
      cupomError.value = response.data.error;
    }
  } catch (error) {
    console.error("Erro ao aplicar cupom:", error);
    cupomError.value = "Erro ao aplicar cupom. Tente novamente.";
  }
}

// Remover item do carrinho
async function removeItem(item: CartItem) {
  try {
    await removeItemFromCart({
      itemId: item.itemId,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    });
  } catch (error) {
    console.error("Erro ao remover item:", error);
  }
}

// Aumentar quantidade
async function increaseQuantity(item: CartItem) {
  try {
    await updateQuantity({
      itemId: item.itemId,
      quantity: item.quantity + 1,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    });
  } catch (error) {
    console.error("Erro ao aumentar quantidade:", error);
  }
}

// Diminuir quantidade
async function decreaseQuantity(item: CartItem) {
  if (item.quantity <= 1) {
    await removeItem(item);
  } else {
    try {
      await updateQuantity({
        itemId: item.itemId,
        quantity: item.quantity - 1,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      });
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error);
    }
  }
}

// Finalizar compra
function checkout() {
  // Implementar lógica de checkout
  console.log("Finalizar compra");
  // Redirecionar para página de checkout ou abrir modal
}

function handleClick() {
  show.value = !show.value;
}

// Buscar detalhes dos produtos quando o carrinho mudar
watch(cart, fetchProductDetails, { deep: true });

// Inicializar userId (substituir pela sua lógica de autenticação)
onMounted(() => {
  // Exemplo: pegar userId do localStorage ou store
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
    userId.value = storedUserId;
  }

  fetchProductDetails();
});
</script>

<style scoped>
/* Fade transition for cart */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.cart-button {
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 0;
}
.cart-button img {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08));
}
.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--vt-c-orange, #ff9800);
  color: #fff;
  border-radius: 50%;
  font-size: 0.85rem;
  padding: 2px 7px;
  font-weight: bold;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.cart {
  color: #222;
  position: absolute;
  top: 60px;
  right: 10px;
  background: #fff;
  border-radius: 16px;
  border: none;
  width: 370px;
  max-width: 95vw;
  min-height: 120px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  z-index: 1000;
  padding: 0 0 16px 0;
  animation: cart-pop 0.25s;
}
@keyframes cart-pop {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.cart-items-container {
  max-height: 50vh;
  overflow-y: auto;
  padding: 0 22px;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 10px 22px;
  border-bottom: 1px solid #f0f0f0;
}
.cart-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vt-c-orange, #ff9800);
}
.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #e53935;
}

.cart-loading,
.cart-error,
.cart-empty {
  text-align: center;
  padding: 32px 0 24px 0;
  color: #aaa;
}

.cart-error {
  color: #e53935;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: var(--vt-c-orange, #ff9800);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #e65100;
}

.empty-img {
  width: 80px;
  margin-bottom: 10px;
  opacity: 0.7;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 22px 10px 22px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}
.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  background: #f7f7f7;
  border: 1px solid #eee;
}
.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.cart-item-title {
  font-weight: 600;
  font-size: 1.08rem;
  margin-bottom: 2px;
}
.cart-item-details {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2px;
  display: flex;
  gap: 10px;
}
.cart-item-qty {
  font-size: 0.95rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  background: var(--vt-c-orange, #ff9800);
  color: #fff;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.qty-btn:hover {
  background: #e65100;
}

.cart-item-price {
  font-weight: 700;
  color: var(--vt-c-orange, #ff9800);
  font-size: 1.05rem;
  margin-top: 2px;
}
.remove-btn {
  background: none;
  border: none;
  color: #e53935;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 0;
  padding: 0 6px;
  transition: color 0.2s;
}
.remove-btn:hover {
  color: #b71c1c;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 600;
  padding: 16px 22px 0 22px;
  color: #222;
}
.cart-total-price {
  color: var(--vt-c-orange, #ff9800);
  font-size: 1.25rem;
  font-weight: 700;
}

.checkout-btn {
  margin: 18px 22px 0 22px;
  width: calc(100% - 44px);
  background: var(--vt-c-orange, #ff9800);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.08);
}
.checkout-btn:hover {
  background: #e65100;
  transform: translateY(-2px) scale(1.03);
}

.coupon-input {
  width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.cart-coupon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  margin-top: 10px;
}

.apply-coupon-btn {
  margin-left: 10px;
  padding: 8px 12px;
  background: var(--vt-c-orange, #ff9800);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.apply-coupon-btn:hover {
  background: #e65100;
  transform: translateY(-2px) scale(1.03);
}

.error-message {
  color: #e53935;
  font-size: 0.9rem;
  padding: 0 22px;
  display: block;
  margin-top: -10px;
}
</style>
