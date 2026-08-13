import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { ModelInfo } from './pages/ModelInfo';
import { PredictionHistory } from './pages/PredictionHistory';
import { useBinanceWebSocket } from './hooks/useBinanceWebSocket';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'model' | 'history'>('dashboard');

  // Live WebSocket ticks for BTC, ETH and 1m Kline
  const wsState = useBinanceWebSocket('1m');

  const lastUpdatedFormatted = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          wsStatus={wsState.wsStatus}
          lastUpdated={lastUpdatedFormatted}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              wsBtcPrice={wsState.btcPrice}
              wsBtcChange={wsState.btcChangePercent}
              wsEthPrice={wsState.ethPrice}
              wsEthChange={wsState.ethChangePercent}
              lastKlineTick={wsState.lastKlineTick}
            />
          )}

          {activeTab === 'model' && <ModelInfo />}

          {activeTab === 'history' && <PredictionHistory />}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;
