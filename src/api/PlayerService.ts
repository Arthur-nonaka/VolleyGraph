import axios, { AxiosResponse } from "axios";
const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

const api = axios.create({
  baseURL: `${SERVER_ADDRESS}/player`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const createPlayer = async (playerData: any): Promise<AxiosResponse> =>
  api.post("", playerData);
export const getPlayer = async (filters: any) => api.get("", {params: filters});
export const getPlayerById = async (id: string) => api.get(`/${id}`);
export const updatePlayer = async (id: string, playerData: any) =>
  api.put(`/${id}`, playerData);
export const deletePlayer = async (id: string) => api.delete(`/${id}`);

export const PlayerService = {
  createPlayer,
  getPlayer,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};
export default PlayerService;

export const positionTranslations: Record<string, string> = {
  "Outside Hitter": "Ponta",
  "Opposite Hitter": "Oposto",
  Setter: "Levantador",
  "Middle Blocker": "Central",
  Libero: "Líbero",
  "Server Specialist": "Especialista em saque",
  "Defense Specialist": "Especialista em defesa",
};
