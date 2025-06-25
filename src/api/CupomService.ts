import axios, { AxiosResponse } from "axios";

const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

const api = axios.create({
  baseURL: `${SERVER_ADDRESS}/cupom`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createCupom = async (cupomData: any) => api.post("", cupomData);
export const getCupom = async (filters?: any) =>
  api.get("", { params: filters });
export const validateCupom = async (name: string) =>
  api.post("validate", { name });
export const getCupomById = async (id: string) => api.get(`/${id}`);
export const updateCupom = async (id: string, cupomData: any) =>
  api.put(`/${id}`, cupomData);
export const deleteCupom = async (id: string) => api.delete(`/${id}`);

export const CupomService = {
  createCupom,
  getCupom,
  getCupomById,
  updateCupom,
  validateCupom,
  deleteCupom,
};
export default CupomService;
