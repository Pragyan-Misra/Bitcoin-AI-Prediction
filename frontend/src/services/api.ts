import axios from 'axios';
import { KlineData, TickerData, GoldData, PredictionResult, PredictionHistoryRecord, Timeframe } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const getBitcoinKlines = async (interval: Timeframe = '1m', limit: number = 100): Promise<KlineData[]> => {
  const response = await api.get<{ symbol: string; interval: string; data: KlineData[] }>(
    `/api/bitcoin/klines`,
    { params: { interval, limit } }
  );
  return response.data.data;
};

export const getBitcoinTicker = async (): Promise<TickerData> => {
  const response = await api.get<TickerData>(`/api/bitcoin/ticker`);
  return response.data;
};

export const getEthereumTicker = async (): Promise<TickerData> => {
  const response = await api.get<TickerData>(`/api/ethereum/ticker`);
  return response.data;
};

export const getGoldMarketData = async (): Promise<GoldData> => {
  const response = await api.get<GoldData>(`/api/gold`);
  return response.data;
};

export const postRunPrediction = async (): Promise<PredictionResult> => {
  const response = await api.post<PredictionResult>(`/api/predict`);
  return response.data;
};

export const getPredictionHistory = async (limit: number = 20): Promise<PredictionHistoryRecord[]> => {
  const response = await api.get<PredictionHistoryRecord[]>(`/api/predictions/history`, {
    params: { limit }
  });
  return response.data;
};
