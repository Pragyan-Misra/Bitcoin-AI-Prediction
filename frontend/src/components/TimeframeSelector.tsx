import React from 'react';
import { Timeframe } from '../types';
import { Loader2 } from 'lucide-react';

interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  isLoading: boolean;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onSelectTimeframe,
  isLoading,
}) => {
  const timeframes: Timeframe[] = ['1m', '15m', '1h'];

  return (
    <div className="flex items-center space-x-1.5 bg-card/80 p-1 rounded-xl border border-border">
      {timeframes.map((tf) => {
        const isSelected = selectedTimeframe === tf;
        return (
          <button
            key={tf}
            onClick={() => onSelectTimeframe(tf)}
            disabled={isLoading && isSelected}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
              isSelected
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>{tf}</span>
            {isLoading && isSelected && <Loader2 className="w-3 h-3 animate-spin text-black" />}
          </button>
        );
      })}
    </div>
  );
};
