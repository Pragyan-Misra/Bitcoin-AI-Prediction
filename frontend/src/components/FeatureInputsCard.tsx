import React from 'react';
import { FeaturesSnapshot } from '../types';
import { Layers, Activity, BarChart2, Zap } from 'lucide-react';

interface FeatureInputsCardProps {
  features: FeaturesSnapshot | null;
}

export const FeatureInputsCard: React.FC<FeatureInputsCardProps> = ({ features }) => {
  if (!features) return null;

  const featureItems = [
    { label: 'BTC Close Price', value: `$${features.btcClose.toLocaleString()}`, icon: Zap, color: 'text-amber-400' },
    { label: 'ETH Close Price', value: `$${features.ethClose.toLocaleString()}`, icon: Zap, color: 'text-indigo-400' },
    { label: 'Gold Close Price', value: `$${features.goldClose.toLocaleString()}`, icon: Zap, color: 'text-amber-300' },
    { label: 'BTC 1H Volume', value: `${features.btcVolume.toLocaleString()} BTC`, icon: BarChart2, color: 'text-cyan-400' },
    { label: 'BTC Volatility (20-Period)', value: `${(features.btcVol20 * 100).toFixed(4)}%`, icon: Activity, color: 'text-rose-400' },
    { label: 'BTC Average True Range (ATR 14)', value: `$${features.btcAtr14.toFixed(2)}`, icon: Activity, color: 'text-emerald-400' },
    { label: 'BTC-ETH Correlation (24h)', value: features.btcEthCorr.toFixed(4), icon: Layers, color: 'text-indigo-300' },
    { label: 'BTC-Gold Correlation (24h)', value: features.btcGoldCorr.toFixed(4), icon: Layers, color: 'text-amber-200' },
  ];

  return (
    <div className="bg-card/90 border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">DEEP LEARNING MODEL FEATURE INPUTS</h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          12 Master Inputs (60-Hour Window)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {featureItems.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="bg-surface/90 border border-border p-3.5 rounded-xl hover:border-slate-700 transition-all">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono mb-1">
                <IconComponent className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <span className={`text-sm sm:text-base font-bold font-mono ${item.color}`}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
