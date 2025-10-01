import axios, { AxiosResponse } from "axios";

const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS;

const api = axios.create({
  baseURL: `${SERVER_ADDRESS}/match`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Criar partida
export const createMatch = async (matchData: any): Promise<AxiosResponse> =>
  api.post("", matchData);

// Buscar todas as partidas
export const getMatches = async (): Promise<AxiosResponse> => api.get("");

// Buscar partida por ID
export const getMatchById = async (id: string): Promise<AxiosResponse> =>
  api.get(`/${id}`);

// Atualizar partida (placares ou estatísticas)
export const updateMatch = async (id: string, data: any): Promise<AxiosResponse> =>
  api.put(`/${id}`, data);

// Deletar partida
export const deleteMatch = async (id: string): Promise<AxiosResponse> =>
  api.delete(`/${id}`);

export const matchService = {
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  deleteMatch,
};

export default matchService;
