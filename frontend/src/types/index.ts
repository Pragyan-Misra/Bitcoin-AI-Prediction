export type Timeframe = '1m' | '15m' | '1h';

export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickerData {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  quoteVolume24h?: number;
  timestamp: number;
}

export interface GoldData {
  symbol: string;
  currentPrice: number;
  changePercent: number;
  source: string;
  timestamp: number;
}

export interface FeaturesSnapshot {
  btcClose: number;
  ethClose: number;
  goldClose: number;
  btcVolume: number;
  btcVol20: number;
  btcAtr14: number;
  btcEthCorr: number;
  btcGoldCorr: number;
}

export interface PredictionResult {
  predictionId?: number;
  is_real_model: boolean;
  model_status: string;
  currentPrice: number;
  predictedPrice: number;
  changePercent: number;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  targetH1: number;
  targetH24: number;
  stopLoss: number;
  rrRatio: number;
  h1_median_return: number;
  h24_median_return: number;
  btc_gold_corr: number;
  btc_eth_corr: number;
  features: FeaturesSnapshot;
  timestamp?: string;
}

export interface PredictionHistoryRecord {
  id: number;
  timestamp: string;
  current_btc: number;
  predicted_btc: number;
  change_percent: number;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  target_h1?: number;
  target_h24?: number;
  stop_loss?: number;
  rr_ratio?: number;
  eth_price: number;
  gold_price: number;
  timeframe: string;
  model_version: string;
}
