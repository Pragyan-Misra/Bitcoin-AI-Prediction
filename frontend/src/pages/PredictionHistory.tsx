import React, { useState, useEffect } from 'react';
import { PredictionHistoryRecord } from '../types';
import { getPredictionHistory } from '../services/api';
import { History, RefreshCw, ArrowUpRight, ArrowDownRight, Minus, Calendar } from 'lucide-react';

export const PredictionHistory: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const records = await getPredictionHistory(30);
      setHistory(records);
    } catch (err) {
      console.error('Failed to fetch prediction history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">AI PREDICTION HISTORY LOG</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Historical record of model inference runs persisted in database
            </p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-xl transition-all border border-slate-700 flex items-center space-x-2 w-max"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>REFRESH LOGS</span>
        </button>
      </div>

      {/* History Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/80 border-b border-border text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">ID & Time</th>
                <th className="py-3.5 px-4">Current BTC</th>
                <th className="py-3.5 px-4">Predicted BTC</th>
                <th className="py-3.5 px-4">Expected Change</th>
                <th className="py-3.5 px-4">Direction</th>
                <th className="py-3.5 px-4">Stop-Loss</th>
                <th className="py-3.5 px-4">ETH Price</th>
                <th className="py-3.5 px-4">Gold Price</th>
                <th className="py-3.5 px-4">Model Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    <span>Loading historical prediction records...</span>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No prediction history logs recorded yet. Run a prediction on the Dashboard!
                  </td>
                </tr>
              ) : (
                history.map((item) => {
                  const isUp = item.direction === 'UP';
                  const isDown = item.direction === 'DOWN';
                  const dateStr = new Date(item.timestamp).toLocaleString();

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="font-bold text-white">#{item.id}</div>
                        <div className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white">
                        ${item.current_btc.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-cyan-300">
                        ${item.predicted_btc.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        <span className={item.change_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {item.change_percent >= 0 ? '+' : ''}
                          {item.change_percent.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isUp && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>UP</span>
                          </span>
                        )}
                        {isDown && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                            <ArrowDownRight className="w-3 h-3" />
                            <span>DOWN</span>
                          </span>
                        )}
                        {!isUp && !isDown && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-300 border border-slate-500/30 text-[10px] font-bold">
                            <Minus className="w-3 h-3" />
                            <span>NEUTRAL</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        ${item.stop_loss ? item.stop_loss.toLocaleString() : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-indigo-300">
                        ${item.eth_price.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-amber-300">
                        ${item.gold_price.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {item.model_version}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
