<template>
  <transition name="fade">
    <div
      v-if="props.showCheckout"
      class="checkout-modal-overlay"
      @click="handleClose"
    >
      <div class="checkout-modal" @click.stop>
        <div class="checkout-header">
          <h2>Finalizar Compra</h2>
          <button class="close-btn" @click="handleClose">&times;</button>
        </div>

        <form @submit.prevent="finalizePurchase" class="checkout-form">
          <div class="checkout-section">
            <h3>Endereço de Entrega</h3>
            <div class="form-group">
              <label for="street">Rua:</label>
              <input
                id="street"
                v-model="deliveryAddress.street"
                type="text"
                required
                class="form-input"
                placeholder="Nome da rua"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="number">Número:</label>
                <input
                  id="number"
                  v-model="deliveryAddress.number"
                  type="text"
                  required
                  class="form-input"
                  placeholder="123"
                />
              </div>
              <div class="form-group">
                <label for="complement">Complemento:</label>
                <input
                  id="complement"
                  v-model="deliveryAddress.complement"
                  type="text"
                  class="form-input"
                  placeholder="Apto 101"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="neighborhood">Bairro:</label>
              <input
                id="neighborhood"
                v-model="deliveryAddress.neighborhood"
                type="text"
                required
                class="form-input"
                placeholder="Nome do bairro"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="city">Cidade:</label>
                <input
                  id="city"
                  v-model="deliveryAddress.city"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Nome da cidade"
                />
              </div>
              <div class="form-group">
                <label for="state">Estado:</label>
                <input
                  id="state"
                  v-model="deliveryAddress.state"
                  type="text"
                  required
                  class="form-input"
                  placeholder="SP"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="zipCode">CEP:</label>
              <input
                id="zipCode"
                v-model="deliveryAddress.zipCode"
                type="text"
                required
                class="form-input"
                placeholder="00000-000"
              />
            </div>
          </div>

          <div class="checkout-section">
            <h3>Método de Pagamento</h3>
            <div class="payment-methods">
              <label class="payment-option">
                <input
                  type="radio"
                  value="CREDIT_CARD"
                  v-model="selectedPaymentMethod"
                  required
                />
                <span>Cartão de Crédito</span>
              </label>
              <label class="payment-option">
                <input
                  type="radio"
                  value="DEBIT_CARD"
                  v-model="selectedPaymentMethod"
                  required
                />
                <span>Cartão de Débito</span>
              </label>
              <label class="payment-option">
                <input
                  type="radio"
                  value="PIX"
                  v-model="selectedPaymentMethod"
                  required
                />
                <span>PIX</span>
              </label>
              <label class="payment-option">
                <input
                  type="radio"
                  value="CASH"
                  v-model="selectedPaymentMethod"
                  required
                />
                <span>Dinheiro</span>
              </label>
            </div>
          </div>

          <div class="checkout-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>R$ {{ totalPrice.toFixed(2) }}</span>
            </div>
            <div v-if="discount > 0" class="summary-row">
              <span>Desconto:</span>
              <span class="discount-amount">
                - R$ {{ ((totalPrice * discount) / 100).toFixed(2) }}
              </span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span class="total-amount">
                R$ {{ (totalPrice - (totalPrice * discount) / 100).toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="checkout-actions">
            <button type="button" @click="handleClose" class="cancel-btn">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="checkoutLoading"
              class="confirm-purchase-btn"
            >
              {{ checkoutLoading ? "Processando..." : "Confirmar Compra" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SaleService, { PaymentMethod, DeliveryAddress } from "@/api/SaleService";

// Props para receber dados do carrinho e valores
const props = defineProps<{
  showCheckout: boolean;
  totalPrice: number;
  discount: number;
  fetchCart?: () => Promise<void>;
}>();

const emit = defineEmits(["close", "purchase-success"]);

const checkoutLoading = ref(false);
const selectedPaymentMethod = ref<PaymentMethod>();
const notes = ref("");
const deliveryAddress = ref<DeliveryAddress>({
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
});

function handleClose() {
  emit("close");
  selectedPaymentMethod.value = undefined;
  notes.value = "";
  deliveryAddress.value = {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  };
}

async function finalizePurchase() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Usuário não identificado. Faça login para continuar.");
    return;
  }
  if (!selectedPaymentMethod.value) {
    alert("Selecione um método de pagamento.");
    return;
  }
  checkoutLoading.value = true;
  try {
    const response = await SaleService.createSaleFromCart({
      userId,
      paymentMethod: selectedPaymentMethod.value,
      deliveryAddress: deliveryAddress.value,
      notes: notes.value || undefined,
    });
    handleClose();
    emit("purchase-success");
    if (props.fetchCart) await props.fetchCart();
  } catch (error: any) {
    console.error("Erro ao finalizar compra:", error);
    alert(
      error.response?.data?.error ||
        "Erro ao finalizar compra. Tente novamente."
    );
  } finally {
    checkoutLoading.value = false;
  }
}
// Exporta o componente para importação padrão
defineExpose({});
</script>
<script lang="ts">
export default {};
</script>
<style scoped>
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

/* Checkout Modal Styles */
.checkout-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.checkout-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  color: black;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.checkout-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.checkout-form {
  padding: 24px;
}

.checkout-section {
  margin-bottom: 24px;
}

.checkout-section h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--vt-c-orange, #ff9800);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.payment-option:hover {
  background-color: #f9f9f9;
  border-color: var(--vt-c-orange, #ff9800);
}

.payment-option input[type="radio"] {
  margin: 0;
}

.checkout-summary {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.total-row {
  border-top: 1px solid #ddd;
  padding-top: 8px;
  margin-top: 8px;
  font-weight: 600;
  font-size: 1.1rem;
}

.discount-amount {
  color: #4caf50;
}

.total-amount {
  color: var(--vt-c-orange, #ff9800);
  font-weight: 700;
}

.checkout-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 12px 24px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s, border-color 0.2s;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
}

.confirm-purchase-btn {
  padding: 12px 24px;
  background: var(--vt-c-orange, #ff9800);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s;
}

.confirm-purchase-btn:hover:not(:disabled) {
  background: #e65100;
  transform: translateY(-1px);
}

.confirm-purchase-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
</style>
