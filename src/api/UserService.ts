import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:3000/user",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createUser = async (userData: any): Promise<AxiosResponse> =>
  api.post("", userData);
export const getUser = async () => api.get("");
export const loginUser = async () => api.get("/login");
export const getUserById = async (id: string) => api.get(`/${id}`);
export const updateUser = async (id: string, userData: any) =>
  api.put(`/${id}`, userData);
export const deletePlayer = async (id: string) => api.delete(`/${id}`);

export const UserService = {
  createUser,
  getUser,
  loginUser,
  getUserById,
  updateUser,
  deletePlayer,
};
export default UserService;
