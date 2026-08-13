import React from 'react';
import { TrendingUp, TrendingDown, Coins, CircleDollarSign, Flame } from 'lucide-react';

interface MarketCardProps {
  title: string;
  symbol: string;
  price: number | null;
  changePercent: number | null;
  volumeOrSource?: string;
  iconType: 'btc' | 'eth' | 'gold';
  isLoading?: boolean;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  title,
  symbol,
  price,
  changePercent,
  volumeOrSource,
  iconType,
  isLoading = false,
}) => {
  const isPositive = (changePercent ?? 0) >= 0;

  const renderIcon = () => {
    switch (iconType) {
      case 'btc':
        return (
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            ₿
          </div>
        );
      case 'eth':
        return (
          <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            Ξ
          </div>
        );
      case 'gold':
        return (
          <div className="w-9 h-9 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold">
            <Coins className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="bg-card/90 border border-border/80 rounded-2xl p-4 sm:p-5 hover:border-cyan-500/30 transition-all shadow-md group relative overflow-hidden">
      {/* Background glow accent */}
      <div
        className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none transition-all ${
          isPositive ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {renderIcon()}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
            <span className="text-xs text-slate-400 font-mono">{symbol}</span>
          </div>
        </div>

        {/* Change Badge */}
        {changePercent !== null && (
          <div
            className={`flex items-center space-x-1 text-xs font-mono font-semibold px-2.5 py-1 rounded-full border ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>
              {isPositive ? '+' : ''}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Main Price Display */}
      <div className="mt-2">
        {isLoading || price === null ? (
          <div className="h-8 w-32 bg-slate-800 animate-pulse rounded-md" />
        ) : (
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {volumeOrSource && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{volumeOrSource}</span>
          <span className="text-[10px] text-slate-500">REAL-TIME</span>
        </div>
      )}
    </div>
  );
};
