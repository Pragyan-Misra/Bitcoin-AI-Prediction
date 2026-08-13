import React from 'react';
import { Cpu, Layers, GitBranch, Zap, ShieldCheck, HelpCircle, HardDrive, Sliders } from 'lucide-react';

export const ModelInfo: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              FocusedBTC_Transformer Architecture
            </h1>
            <p className="text-sm text-cyan-400 font-mono">
              Deep Learning Multi-Horizon Quantile Transformer
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mt-4">
          This deep learning architecture models non-linear inter-market relationships between Bitcoin (BTC), Ethereum (ETH), and Gold market data, combined with NLP news sentiment vectors to produce calibrated 1-hour (H1) and 24-hour (H24) price forecasts.
        </p>
      </div>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Component 1: Architecture Layers */}
        <div className="bg-card/90 border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Neural Architecture Breakdown</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="bg-surface p-3 rounded-xl border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">1. Variable Selection Network (VSN)</span>
              <p className="text-slate-300">
                Dynamically computes soft feature-importance weights across all 12 input columns at every sequence time step.
              </p>
            </div>

            <div className="bg-surface p-3 rounded-xl border border-slate-800">
              <span className="text-indigo-400 font-bold block mb-1">2. FinBERT News Sentiment Cross-Attention</span>
              <p className="text-slate-300">
                Projects ProsusAI/FinBERT 768-dimensional headline embeddings into model hidden state using Multi-Head Cross Attention.
              </p>
            </div>

            <div className="bg-surface p-3 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">3. Transformer Encoder Layer</span>
              <p className="text-slate-300">
                Captures temporal dependencies across 60-hour rolling windows with multi-head self-attention mechanisms.
              </p>
            </div>

            <div className="bg-surface p-3 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">4. Multi-Horizon Quantile Heads</span>
              <p className="text-slate-300">
                Predicts calibrated price quantile distributions [10th percentile, 50th median, 90th percentile] for 1-hour and 24-hour targets.
              </p>
            </div>
          </div>
        </div>

        {/* Component 2: Hyperparameters & Training Specs */}
        <div className="bg-card/90 border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Training Hyperparameters</h3>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Model Framework:</span>
              <span className="text-white font-bold">PyTorch 2.x</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Sequence Window:</span>
              <span className="text-cyan-400 font-bold">60 Time Steps (60 Hours)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Numeric Features:</span>
              <span className="text-white font-bold">12 Master Market Features</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Optimizer:</span>
              <span className="text-white font-bold">Adam (lr = 0.0005)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Loss Function:</span>
              <span className="text-amber-400 font-bold">MultiHorizonQuantileLoss</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Batch Size / Epochs:</span>
              <span className="text-white font-bold">Batch 128 / 100 Epochs</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Quantiles Evaluated:</span>
              <span className="text-emerald-400 font-bold">[0.1, 0.5, 0.9]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Placement Instructions Card */}
      <div className="bg-card/90 border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <HardDrive className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Model Weights Drop-In Instructions</h3>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
          <p className="text-slate-300">
            To place your trained model file into the backend, place your PyTorch state dictionary checkpoint at:
          </p>
          <div className="bg-black/60 p-3 rounded-lg text-cyan-300 font-mono text-xs border border-cyan-500/20 overflow-x-auto">
            backend/app/model/saved_models/blackrock_beater_best.pth
          </div>
          <p className="text-slate-400 mt-2">
            Once placed, the backend automatically detects the checkpoint file and switches from the fallback engine to full PyTorch GPU/CPU inference!
          </p>
        </div>
      </div>
    </div>
  );
};
