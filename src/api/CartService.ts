import axios, { AxiosResponse } from "axios";
const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

const api = axios.create({
  baseURL: `${SERVER_ADDRESS}/cart`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get cart by user ID
export const getCart = async (userId: string): Promise<AxiosResponse> =>
  api.get(`/${userId}`);

// Get all carts (admin function)
export const getAllCarts = async (): Promise<AxiosResponse> =>
  api.get("/all");

// Create a new cart
export const createCart = async (cartData: {
  userId: string;
  items?: Array<{
    itemId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }>;
}): Promise<AxiosResponse> =>
  api.post("", cartData);

// Add item to cart
export const addItemToCart = async (
  userId: string,
  itemData: {
    itemId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }
): Promise<AxiosResponse> =>
  api.post(`/${userId}/item`, itemData);

// Remove item from cart
export const removeItemFromCart = async (
  userId: string,
  itemData: {
    itemId: string;
    selectedColor?: string;
    selectedSize?: string;
  }
): Promise<AxiosResponse> =>
  api.delete(`/${userId}/item`, { data: itemData });

// Update item quantity in cart
export const updateItemQuantity = async (
  userId: string,
  itemData: {
    itemId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }
): Promise<AxiosResponse> =>
  api.put(`/${userId}/item`, itemData);

// Clear cart
export const clearCart = async (userId: string): Promise<AxiosResponse> =>
  api.delete(`/${userId}/clear`);

// Delete cart completely
export const deleteCart = async (userId: string): Promise<AxiosResponse> =>
  api.delete(`/${userId}`);

// Get cart summary
export const getCartSummary = async (userId: string): Promise<AxiosResponse> =>
  api.get(`/${userId}/summary`);

export const CartService = {
  getCart,
  getAllCarts,
  createCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  deleteCart,
  getCartSummary,
};

export default CartService;
