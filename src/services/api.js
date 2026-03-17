import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

export const analyzeStock = (symbol) =>
  API.get(`/stock/${symbol}`);

export const scanMarket = () =>
  API.get(`/stock/scan`);