import { useState, useEffect, useRef } from 'react';
import { Timeframe, KlineData } from '../types';

interface LivePriceState {
  btcPrice: number | null;
  btcChangePercent: number | null;
  ethPrice: number | null;
  ethChangePercent: number | null;
  lastKlineTick: KlineData | null;
  wsStatus: 'connecting' | 'connected' | 'error' | 'closed';
}

export const useBinanceWebSocket = (interval: Timeframe = '1m') => {
  const [state, setState] = useState<LivePriceState>({
    btcPrice: null,
    btcChangePercent: null,
    ethPrice: null,
    ethChangePercent: null,
    lastKlineTick: null,
    wsStatus: 'connecting',
  });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Binance combined stream for BTC ticker, ETH ticker, and BTC klines
    const streamName = `btcusdt@ticker/ethusdt@ticker/btcusdt@kline_${interval}`;
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streamName}`;

    setState((prev) => ({ ...prev, wsStatus: 'connecting' }));

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setState((prev) => ({ ...prev, wsStatus: 'connected' }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const stream = message.stream;
        const data = message.data;

        if (!data) return;

        if (stream === 'btcusdt@ticker') {
          const price = parseFloat(data.c);
          const changePct = parseFloat(data.P);
          setState((prev) => ({
            ...prev,
            btcPrice: price,
            btcChangePercent: changePct,
          }));
        } else if (stream === 'ethusdt@ticker') {
          const price = parseFloat(data.c);
          const changePct = parseFloat(data.P);
          setState((prev) => ({
            ...prev,
            ethPrice: price,
            ethChangePercent: changePct,
          }));
        } else if (stream.includes('@kline_')) {
          const k = data.k;
          if (k) {
            const klineTick: KlineData = {
              time: Math.floor(k.t / 1000),
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
              volume: parseFloat(k.v),
            };
            setState((prev) => ({
              ...prev,
              lastKlineTick: klineTick,
            }));
          }
        }
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };

    ws.onerror = () => {
      setState((prev) => ({ ...prev, wsStatus: 'error' }));
    };

    ws.onclose = () => {
      setState((prev) => ({ ...prev, wsStatus: 'closed' }));
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [interval]);

  return state;
};
