import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, HistogramData, ColorType } from 'lightweight-charts';
import { KlineData, Timeframe } from '../types';
import { TimeframeSelector } from './TimeframeSelector';
import { Maximize2, RefreshCw } from 'lucide-react';

interface BitcoinChartProps {
  klines: KlineData[];
  selectedTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  isLoading: boolean;
  onRefresh?: () => void;
  lastKlineTick?: KlineData | null;
}

export const BitcoinChart: React.FC<BitcoinChartProps> = ({
  klines,
  selectedTimeframe,
  onSelectTimeframe,
  isLoading,
  onRefresh,
  lastKlineTick,
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  // Initialize Lightweight Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { type: ColorType.Solid, color: '#121722' },
        textColor: '#94a3b8',
        fontSize: 12,
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#06b6d4', width: 1, style: 2 },
        horzLine: { color: '#06b6d4', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: '#26334d',
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: '#26334d',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#f43f5e',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // Add Volume Histogram Series
    const volumeSeries = chart.addHistogramSeries({
      color: '#06b6d4',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.75,
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    // Handle Resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update Data when klines change
  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || klines.length === 0) return;

    // Format & sort data for Lightweight Charts
    const formattedCandles: CandlestickData[] = klines.map((k) => ({
      time: k.time as any,
      open: k.open,
      high: k.high,
      low: k.low,
      close: k.close,
    }));

    const formattedVolume: HistogramData[] = klines.map((k) => ({
      time: k.time as any,
      value: k.volume,
      color: k.close >= k.open ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)',
    }));

    candlestickSeriesRef.current.setData(formattedCandles);
    volumeSeriesRef.current.setData(formattedVolume);

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [klines]);

  // Real-time live candle update via WebSocket
  useEffect(() => {
    if (!lastKlineTick || !candlestickSeriesRef.current || !volumeSeriesRef.current) return;

    try {
      candlestickSeriesRef.current.update({
        time: lastKlineTick.time as any,
        open: lastKlineTick.open,
        high: lastKlineTick.high,
        low: lastKlineTick.low,
        close: lastKlineTick.close,
      });

      volumeSeriesRef.current.update({
        time: lastKlineTick.time as any,
        value: lastKlineTick.volume,
        color: lastKlineTick.close >= lastKlineTick.open ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)',
      });
    } catch (e) {
      // Ignored for slight timestamp drift
    }
  }, [lastKlineTick]);

  return (
    <div className="bg-card/90 border border-border/80 rounded-2xl p-4 sm:p-6 shadow-xl relative">
      {/* Chart Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>BTC / USDT</span>
            <span className="text-xs text-slate-400 font-mono font-normal">
              (Binance Candlestick & Volume Chart)
            </span>
          </h3>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={onSelectTimeframe}
            isLoading={isLoading}
          />

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50"
              title="Refresh Chart Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Lightweight Chart Container */}
      <div className="relative min-h-[420px] w-full rounded-xl overflow-hidden bg-[#121722]">
        {isLoading && (
          <div className="absolute inset-0 bg-[#121722]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm font-mono text-cyan-300">Fetching Binance Kline Data ({selectedTimeframe})...</span>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-[420px]" />
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Bullish Candle</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Bearish Candle</span>
          </span>
        </div>
        <span>Timezone: UTC</span>
      </div>
    </div>
  );
};
