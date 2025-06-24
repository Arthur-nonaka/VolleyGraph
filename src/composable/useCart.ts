import { ref, watch } from "vue";

const CART_KEY = "cart";
export const cart = ref<any[]>(
  JSON.parse(localStorage.getItem(CART_KEY) || "[]")
);

export function addToCart(values: any) {
  const index = cart.value.findIndex((v) => v.item._id === values.item._id);
  if (index !== -1) {
    const newValues = {
      ...values,
      quantity: values.quantity + cart.value[index].quantity,
    };
    updateCartItem(index, newValues);
  } else {
    cart.value.push(values);
  }
}

export function updateCartItem(index: number, updatedItem: any) {
  if (index >= 0 && index < cart.value.length) {
    cart.value[index] = updatedItem;
  } else {
    console.warn("Index out of bounds for cart update.");
  }
}

export function removeFromCart(index: number) {
  cart.value.splice(index, 1);
}

watch(
  cart,
  (newCart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  },
  { deep: true }
);
