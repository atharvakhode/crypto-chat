import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE + "/api" });

export const getTopCoins = async (limit = 10) =>
  (await api.get(`/coins/top?limit=${limit}`)).data;


