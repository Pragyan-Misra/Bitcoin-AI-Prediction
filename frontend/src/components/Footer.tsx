import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface/60 mt-12 py-8 text-xs text-slate-400 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>BTC AI Price Prediction Platform &copy; 2026. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FastAPI Backend Connected</span>
          </span>
          <span className="text-slate-500">Netlify + Render Ready</span>
        </div>
      </div>
    </footer>
  );
};
