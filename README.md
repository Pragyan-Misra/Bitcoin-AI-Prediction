# AI Bitcoin Price Prediction Web Application

Production-Ready Full-Stack Web Application for Bitcoin (BTC) price prediction using Ethereum (ETH) and Gold market data, built with **React (TypeScript + Vite + Tailwind CSS)** and **Python FastAPI**.

Developed around the **FocusedBTC_Transformer** Deep Learning model architecture (Variable Selection Network + FinBERT Cross-Attention + Transformer Encoder + Multi-Horizon Quantile Loss).

---

## Architecture Overview

- **Frontend**: Vite + React (TypeScript), Tailwind CSS, Lucide Icons, Lightweight Charts for candlestick visualizations, and Binance WebSockets (`wss://stream.binance.com:9443`) for live streaming updates.
- **Backend**: Python FastAPI with modular services:
  - `BinanceService`: REST API endpoints for kline history and ticker summaries.
  - `GoldService`: Alpha Vantage API integration for Gold commodity prices (`XAU/USD` / `GC=F`).
  - `PredictionService`: Feature engineering pipeline (12 master features, 60-hour rolling sequence scaling) and PyTorch inference engine.
  - `ModelLoaderService`: Direct PyTorch checkpoint loader for `FocusedBTC_Transformer`.
- **Database**: SQLite/PostgreSQL with SQLAlchemy async session for storing prediction history logs.
- **Deployment Readiness**:
  - **Frontend**: Netlify (`netlify.toml`, `_redirects`, Vite production build).
  - **Backend**: Render.com (`render.yaml`, `Dockerfile`, `Procfile`).

---

## Project Structure

```
btc-prediction-app/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point & CORS
│   │   ├── database/                   # SQLAlchemy models & async DB session
│   │   ├── model/                      # FocusedBTC_Transformer & model_loader
│   │   │   └── saved_models/
│   │   │       └── blackrock_beater_best.pth   # <--- Place your trained model weights here!
│   │   ├── routes/                     # /api/bitcoin, /api/ethereum, /api/gold, /api/predict
│   │   ├── schemas/                    # Pydantic data schemas
│   │   └── services/                   # Binance REST, Gold API, & Prediction pipeline
│   ├── Dockerfile
│   ├── Procfile
│   ├── render.yaml
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/                 # BitcoinChart, PredictionCard, MarketCard, FeatureInputsCard
    │   ├── hooks/                      # useBinanceWebSocket, useMarketData
    │   ├── pages/                      # Dashboard, ModelInfo, PredictionHistory
    │   ├── services/                   # Axios API client
    │   └── types/                      # TypeScript definitions
    ├── netlify.toml
    └── package.json
```

---

## Local Setup Instructions

### 1. Start FastAPI Backend

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend API documentation will be automatically accessible at:
- `http://localhost:8000/docs` (Swagger UI)
- `http://localhost:8000/redoc` (ReDoc)

### 2. Model Weights Placement

Place your trained PyTorch model state dictionary checkpoint into:
`backend/app/model/saved_models/blackrock_beater_best.pth`

*(If the file is not placed yet, the backend automatically runs in heuristic fallback mode so all UI controls remain fully functional!)*

### 3. Start React Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Netlify & Render.com Deployment

### Deploy Backend to Render.com
1. Create a new Web Service on Render linked to your backend GitHub repository.
2. Set Environment Variables:
   - `ALPHA_VANTAGE_API_KEY`: Your Alpha Vantage key for Gold data.
   - `DATABASE_URL`: Your PostgreSQL database URL (or leave default for SQLite).

### Deploy Frontend to Netlify
1. Connect your frontend GitHub repository to Netlify.
2. Build Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Environment Variables:
   - `VITE_API_URL`: Your Render backend service URL (e.g. `https://your-app.onrender.com`).
