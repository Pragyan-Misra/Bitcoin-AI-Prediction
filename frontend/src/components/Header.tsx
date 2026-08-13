import React from 'react';
import { Activity, Cpu, History, LayoutDashboard, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'model' | 'history';
  setActiveTab: (tab: 'dashboard' | 'model' | 'history') => void;
  wsStatus: 'connecting' | 'connected' | 'error' | 'closed';
  lastUpdated: string | null;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, wsStatus, lastUpdated }) => {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <span className="font-extrabold text-white text-xl tracking-tighter">₿</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">BTC Predict</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                AI DEEP LEARNING
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">BTC / ETH / GOLD QUANT MODEL</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('model')}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'model'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span className="hidden sm:inline">Model Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Prediction Log</span>
          </button>
        </nav>

        {/* Right Status Badge */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${
              wsStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {wsStatus === 'connected' ? (
              <>
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden md:inline">BINANCE LIVE WS</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden md:inline">WS RECONNECTING</span>
              </>
            )}
          </div>

          {lastUpdated && (
            <div className="hidden lg:flex items-center space-x-1 text-slate-400">
              <Activity className="w-3.5 h-3.5" />
              <span>{lastUpdated}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
