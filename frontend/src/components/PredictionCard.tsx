import React from 'react';
import { PredictionResult } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, Sparkles, ShieldAlert, Target, RefreshCw, Cpu } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResult | null;
  onRunPrediction: () => void;
  isLoading: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  onRunPrediction,
  isLoading,
}) => {
  const isUp = prediction?.direction === 'UP';
  const isDown = prediction?.direction === 'DOWN';

  return (
    <div className="bg-gradient-to-br from-card via-[#162032] to-card border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">AI PRICE PREDICTION</h2>
              {prediction?.is_real_model ? (
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  MODEL ACTIVE
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  HEURISTIC FALLBACK
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {prediction?.model_status || 'FocusedBTC_Transformer Model Ready'}
            </p>
          </div>
        </div>

        {/* Action Trigger Button */}
        <button
          onClick={onRunPrediction}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'RUNNING INFERENCE...' : 'RUN AI PREDICTION'}</span>
        </button>
      </div>

      {/* Main Prediction Metrics Grid */}
      {prediction ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. CURRENT MARKET PRICE */}
          <div className="bg-surface/80 border border-border p-4 rounded-2xl">
            <span className="text-xs text-slate-400 font-mono block mb-1">CURRENT MARKET PRICE</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              ${prediction.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 font-mono block mt-1">Live Binance Feed</span>
          </div>

          {/* 2. MODEL PREDICTED PRICE */}
          <div className="bg-surface/80 border border-cyan-500/30 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute right-2 top-2">
              <Cpu className="w-4 h-4 text-cyan-400 opacity-40" />
            </div>
            <span className="text-xs text-cyan-400 font-mono font-semibold block mb-1">MODEL PREDICTED PRICE</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
              ${prediction.predictedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-cyan-400/70 font-mono block mt-1">
              Expected Movement: {prediction.changePercent >= 0 ? '+' : ''}
              {prediction.changePercent.toFixed(2)}%
            </span>
          </div>

          {/* 3. EXPECTED MOVEMENT & DIRECTION */}
          <div className="bg-surface/80 border border-border p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-mono mb-1">PREDICTION DIRECTION</span>
            <div className="flex items-center space-x-2">
              {isUp && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold font-mono text-sm">
                  <ArrowUpRight className="w-5 h-5" />
                  <span>BULLISH (UP)</span>
                </div>
              )}
              {isDown && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold font-mono text-sm">
                  <ArrowDownRight className="w-5 h-5" />
                  <span>BEARISH (DOWN)</span>
                </div>
              )}
              {!isUp && !isDown && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-500/15 text-slate-300 border border-slate-500/30 font-bold font-mono text-sm">
                  <Minus className="w-5 h-5" />
                  <span>NEUTRAL</span>
                </div>
              )}
            </div>
            <span className="text-xs text-slate-400 font-mono mt-2">
              Expected Delta: {prediction.changePercent >= 0 ? '+' : ''}
              {prediction.changePercent.toFixed(2)}%
            </span>
          </div>

          {/* 4. RISK MANAGEMENT (Stop-Loss & R:R) */}
          <div className="bg-surface/80 border border-border p-4 rounded-2xl">
            <span className="text-xs text-slate-400 font-mono block mb-1">RISK MANAGEMENT</span>
            <div className="flex items-center justify-between font-mono text-xs text-slate-300 mb-1">
              <span className="flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Stop-Loss:</span>
              </span>
              <span className="font-bold text-rose-400">${prediction.stopLoss.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs text-slate-300">
              <span className="flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>R:R Ratio:</span>
              </span>
              <span className="font-bold text-emerald-400">1 : {prediction.rrRatio}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-2">
              1H Target: ${prediction.targetH1.toLocaleString()} | 24H: ${prediction.targetH24.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-8 bg-surface/50 border border-dashed border-slate-700 rounded-2xl text-center">
          <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-60" />
          <p className="text-slate-300 text-sm font-medium">No active prediction session loaded.</p>
          <p className="text-slate-500 text-xs font-mono mt-1">
            Click &quot;RUN AI PREDICTION&quot; to execute real-time model inference using live BTC, ETH & Gold features.
          </p>
        </div>
      )}
    </div>
  );
};
