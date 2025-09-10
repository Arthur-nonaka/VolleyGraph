import { ref, onMounted } from "vue";
import CartService from "@/api/CartService";

export const useCart = (userId: string) => {
  const cart = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchCart = async () => {
    loading.value = true;
    try {
      const response = await CartService.getCart(userId);
      cart.value = response.data;
      error.value = null;
    } catch (err: any) {
      error.value = err.response?.data?.error || "Erro ao buscar carrinho";
      console.error("Erro ao buscar carrinho:", err);
    } finally {
      loading.value = false;
    }
  };

  const addItem = async (itemData: {
    itemId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }) => {
    loading.value = true;
    try {
      const response = await CartService.addItemToCart(userId, itemData);
      cart.value = response.data.cart;
      error.value = null;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || "Erro ao adicionar item";
      console.error("Erro ao adicionar item:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeItem = async (itemData: {
    itemId: string;
    selectedColor?: string;
    selectedSize?: string;
  }) => {
    loading.value = true;
    try {
      const response = await CartService.removeItemFromCart(userId, itemData);
      cart.value = response.data.cart;
      error.value = null;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || "Erro ao remover item";
      console.error("Erro ao remover item:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateQuantity = async (itemData: {
    itemId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }) => {
    loading.value = true;
    try {
      const response = await CartService.updateItemQuantity(userId, itemData);
      cart.value = response.data.cart;
      error.value = null;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || "Erro ao atualizar quantidade";
      console.error("Erro ao atualizar quantidade:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearCart = async () => {
    loading.value = true;
    try {
      const response = await CartService.clearCart(userId);
      cart.value = response.data.cart;
      error.value = null;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || "Erro ao limpar carrinho";
      console.error("Erro ao limpar carrinho:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getCartSummary = async () => {
    loading.value = true;
    try {
      const response = await CartService.getCartSummary(userId);
      error.value = null;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || "Erro ao buscar resumo";
      console.error("Erro ao buscar resumo:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if (userId) {
      fetchCart();
    }
  });

  return {
    cart,
    loading,
    error,
    fetchCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartSummary,
  };
};
