import axios from "axios";

const API = axios.create({
  baseURL: "", // Vite proxy forwards /stock/* → localhost:8080
});

export const analyzeStock = (symbol) =>
  API.get(`/stock/${symbol}`);

export const scanMarket = () =>
  API.get(`/stock/scan`);