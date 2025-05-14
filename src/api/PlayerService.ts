import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "https://solid-tribble-g6xr9gvpj76hr5g-3000.app.github.dev/player",
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
export const getPlayersForTeam = async (teamId: string) =>
  api.get(`/team/${teamId}`);

export const PlayerService = {
  createPlayer,
  getPlayer,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  getPlayersForTeam,
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
