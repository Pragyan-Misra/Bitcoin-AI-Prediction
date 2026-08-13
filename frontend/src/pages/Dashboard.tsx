import React, { useState, useEffect, useCallback } from 'react';
import { Timeframe, KlineData, TickerData, GoldData, PredictionResult } from '../types';
import { getBitcoinKlines, getBitcoinTicker, getEthereumTicker, getGoldMarketData, postRunPrediction } from '../services/api';
import { MarketCard } from '../components/MarketCard';
import { BitcoinChart } from '../components/BitcoinChart';
import { PredictionCard } from '../components/PredictionCard';
import { FeatureInputsCard } from '../components/FeatureInputsCard';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface DashboardProps {
  wsBtcPrice: number | null;
  wsBtcChange: number | null;
  wsEthPrice: number | null;
  wsEthChange: number | null;
  lastKlineTick: KlineData | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  wsBtcPrice,
  wsBtcChange,
  wsEthPrice,
  wsEthChange,
  lastKlineTick,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1m');
  const [klines, setKlines] = useState<KlineData[]>([]);
  const [btcTicker, setBtcTicker] = useState<TickerData | null>(null);
  const [ethTicker, setEthTicker] = useState<TickerData | null>(null);
  const [goldData, setGoldData] = useState<GoldData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(true);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Kline data when timeframe changes
  const fetchKlineData = useCallback(async (tf: Timeframe) => {
    setIsLoadingChart(true);
    setErrorMsg(null);
    try {
      const data = await getBitcoinKlines(tf, 100);
      setKlines(data);
    } catch (err: any) {
      console.error('Failed to fetch klines:', err);
      setErrorMsg('Unable to load Bitcoin market klines. Please check backend connection.');
    } finally {
      setIsLoadingChart(false);
    }
  }, []);

  // Fetch REST tickers for BTC, ETH, and Gold
  const fetchTickers = useCallback(async () => {
    try {
      const [btc, eth, gold] = await Promise.all([
        getBitcoinTicker().catch(() => null),
        getEthereumTicker().catch(() => null),
        getGoldMarketData().catch(() => null),
      ]);

      if (btc) setBtcTicker(btc);
      if (eth) setEthTicker(eth);
      if (gold) setGoldData(gold);
    } catch (err) {
      console.error('Failed to fetch ticker data:', err);
    }
  }, []);

  // Execute AI Model Prediction
  const handleRunPrediction = async () => {
    setIsLoadingPrediction(true);
    setErrorMsg(null);
    try {
      const result = await postRunPrediction();
      setPrediction(result);
    } catch (err: any) {
      console.error('Failed to run prediction:', err);
      setErrorMsg('Failed to run AI prediction model. Verify Python backend is active.');
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  // Initial Load & Timeframe switch
  useEffect(() => {
    fetchKlineData(selectedTimeframe);
  }, [selectedTimeframe, fetchKlineData]);

  // Initial load tickers & initial prediction run
  useEffect(() => {
    fetchTickers();
    handleRunPrediction();

    // Refresh tickers every 15s
    const interval = setInterval(fetchTickers, 15000);
    return () => clearInterval(interval);
  }, [fetchTickers]);

  // Merge WebSocket live price updates with REST tickers for real-time responsiveness
  const currentBtcPrice = wsBtcPrice ?? btcTicker?.currentPrice ?? null;
  const currentBtcChange = wsBtcChange ?? btcTicker?.priceChangePercent ?? null;
  const currentEthPrice = wsEthPrice ?? ethTicker?.currentPrice ?? null;
  const currentEthChange = wsEthChange ?? ethTicker?.priceChangePercent ?? null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Error Alert Banner */}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between text-rose-300 text-sm font-mono">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-xs bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1 rounded-lg text-rose-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Model Readiness Status Banner */}
      {prediction && !prediction.is_real_model && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between text-amber-300 text-sm font-mono">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span>{prediction.model_status}</span>
          </div>
        </div>
      )}

      {/* Top 3 Real-Time Market Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <MarketCard
          title="Bitcoin"
          symbol="BTC / USDT"
          price={currentBtcPrice}
          changePercent={currentBtcChange}
          volumeOrSource={btcTicker ? `24h Vol: ${btcTicker.volume24h.toLocaleString()} BTC` : 'Binance Live Feed'}
          iconType="btc"
          isLoading={currentBtcPrice === null}
        />

        <MarketCard
          title="Ethereum"
          symbol="ETH / USDT"
          price={currentEthPrice}
          changePercent={currentEthChange}
          volumeOrSource={ethTicker ? `24h Vol: ${ethTicker.volume24h.toLocaleString()} ETH` : 'Binance Live Feed'}
          iconType="eth"
          isLoading={currentEthPrice === null}
        />

        <MarketCard
          title="Gold Commodity"
          symbol={goldData?.symbol || 'XAU / USD'}
          price={goldData?.currentPrice ?? null}
          changePercent={goldData?.changePercent ?? null}
          volumeOrSource={goldData?.source || 'Alpha Vantage Feed'}
          iconType="gold"
          isLoading={goldData === null}
        />
      </div>

      {/* AI Price Prediction Hero Card */}
      <PredictionCard
        prediction={prediction}
        onRunPrediction={handleRunPrediction}
        isLoading={isLoadingPrediction}
      />

      {/* Bitcoin Candlestick + Volume Chart */}
      <BitcoinChart
        klines={klines}
        selectedTimeframe={selectedTimeframe}
        onSelectTimeframe={setSelectedTimeframe}
        isLoading={isLoadingChart}
        onRefresh={() => fetchKlineData(selectedTimeframe)}
        lastKlineTick={lastKlineTick}
      />

      {/* Deep Learning Model Input Features Breakdown */}
      <FeatureInputsCard features={prediction?.features ?? null} />
    </div>
  );
};
