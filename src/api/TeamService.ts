import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "https://solid-tribble-g6xr9gvpj76hr5g-3000.app.github.dev/team",
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

export const teamService = {
  createTeam,
  getTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
};

export default teamService;
