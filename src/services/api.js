import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

export const analyzeStock = (symbol) =>
  API.get(`/stock/${symbol}`);

export const scanMarket = () =>
  API.get(`/stock/scan`);

export const analyzeTrades = (data) =>
  API.post("/trade/analyze", data);

export const uploadTradesCSV = (formData) =>
  API.post("/trade/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });