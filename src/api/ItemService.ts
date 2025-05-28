import axios, { AxiosResponse } from "axios";
const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

const api = axios.create({
  baseURL: `${SERVER_ADDRESS}/item`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const createItem = async (itemData: any): Promise<AxiosResponse> =>
  api.post("", itemData);
export const getItem = async (filters: any) => api.get("", { params: filters });
export const getItemById = async (id: string) => api.get(`/${id}`);
export const updateItem = async (id: string, itemData: any) =>
  api.put(`/${id}`, itemData);
export const deleteItem = async (id: string) => api.delete(`/${id}`);

export const ItemService = {
  createItem,
  getItem,
  getItemById,
  updateItem,
  deleteItem,
};
export default ItemService;
