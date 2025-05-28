import axios, { AxiosResponse } from "axios";

const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

const api = axios.create({
  baseURL: `${SERVER_ADDRESS}/team`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const createTeam = async (TeamData: any): Promise<AxiosResponse> =>
  api.post("", TeamData);
export const getTeam = async (filters: any) => api.get("", {params: filters});
export const getTeamById = async (id: string) => api.get(`/${id}`);
export const updateTeam = async (id: string, TeamData: any) =>
  api.put(`/${id}`, TeamData);
export const deleteTeam = async (id: string) => api.delete(`/${id}`);
export const addPlayerToTeam = async (data: any) =>
  api.post("/player", data);
export const removePlayerFromTeam = async (data: any) =>
  api.delete("/player", data);
export const getTeamsForPlayer = async (playerId: string) =>
  api.get(`/player/${playerId}`);

export const teamService = {
  createTeam,
  getTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  getTeamsForPlayer,
};

export default teamService;
