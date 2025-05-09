import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "https://automatic-garbanzo-q779q4g97v43xjg-3000.app.github.dev/user",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createUser = async (userData: any)=>
  api.post("", userData);
export const getUser = async () => api.get("");
export const loginUser = async (loginData: any) =>
  api.post("/login", loginData);
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
