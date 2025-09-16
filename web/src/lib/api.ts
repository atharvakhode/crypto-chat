import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE + "/api" });

export const getTopCoins = async (limit = 10) =>
  (await api.get(`/coins/top?limit=${limit}`)).data;

export const getHistory = async (cgId: string, days = 30) =>
  (await api.get(`/coins/${cgId}/history?days=${days}`)).data;

export const askQA = async (query: string) =>
  (await api.post(`/qa`, { query })).data;
