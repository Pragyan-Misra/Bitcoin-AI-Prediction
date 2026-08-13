import re
import requests
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.preprocessing import MinMaxScaler
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.binance_service import BinanceService
from app.services.gold_service import GoldService
from app.model.model_loader import model_loader
from app.database.models import PredictionRecord

FEATURE_COLS = [
    'BTC_close', 'BTC_return', 'ETH_close', 'ETH_return', 'GOLD_close', 'GOLD_return',
    'BTC_volume', 'BTC_SMA20', 'BTC_Vol', 'BTC_ATR', 'BTC_ETH_Corr', 'BTC_GOLD_Corr'
]

class PredictionService:
    @staticmethod
    def _fetch_news_headlines() -> List[str]:
        try:
            url = "https://cointelegraph.com/rss"
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(url, headers=headers, timeout=3)
            titles = re.findall(r'<title><!\[CDATA\[(.*?)\]\]></title>', response.text)
            return titles[1:4] if len(titles) > 1 else ["Bitcoin holds key structural levels."]
        except Exception:
            return ["Bitcoin holds key structural levels amid macroeconomic data."]

    @classmethod
    async def generate_prediction(cls, db: AsyncSession = None) -> Dict[str, Any]:
        # 1. Fetch 200 hourly candles for BTC and ETH
        btc_klines = await BinanceService.get_klines(symbol="BTCUSDT", interval="1h", limit=200)
        eth_klines = await BinanceService.get_klines(symbol="ETHUSDT", interval="1h", limit=200)
        gold_data = await GoldService.get_gold_market_data()

        # Build DataFrames
        btc_df = pd.DataFrame(btc_klines).set_index('time')
        eth_df = pd.DataFrame(eth_klines).set_index('time')

        df = pd.DataFrame(index=btc_df.index)
        df['BTC_close'] = btc_df['close']
        df['BTC_high'] = btc_df['high']
        df['BTC_low'] = btc_df['low']
        df['BTC_volume'] = btc_df['volume']
        df['ETH_close'] = eth_df['close']
        df['GOLD_close'] = gold_data['currentPrice']

        # Engineer Features matching training script exactly
        for asset in ['BTC', 'ETH', 'GOLD']:
            df[f'{asset}_return'] = df[f'{asset}_close'].pct_change()

        df['BTC_SMA20'] = df['BTC_close'].rolling(20).mean()
        df['BTC_Vol'] = df['BTC_return'].rolling(20).std()

        df['BTC_TR'] = np.maximum(
            df['BTC_high'] - df['BTC_low'],
            np.maximum(
                abs(df['BTC_high'] - df['BTC_close'].shift(1)),
                abs(df['BTC_low'] - df['BTC_close'].shift(1))
            )
        )
        df['BTC_ATR'] = df['BTC_TR'].rolling(14).mean()

        df['BTC_ETH_Corr'] = df['BTC_return'].rolling(24).corr(df['ETH_return']).fillna(0)
        df['BTC_GOLD_Corr'] = df['BTC_return'].rolling(24).corr(df['GOLD_return']).fillna(0)

        df.dropna(inplace=True)

        # Scale features using MinMaxScaler
        scaler = MinMaxScaler()
        scaled_features = scaler.fit_transform(df[FEATURE_COLS])

        # Get latest 60 time steps
        if len(scaled_features) < 60:
            raise ValueError("Insufficient historical data to construct 60-hour sequence.")

        latest_sequence = scaled_features[-60:]

        current_btc_price = float(df['BTC_close'].iloc[-1])
        current_eth_price = float(df['ETH_close'].iloc[-1])
        current_gold_price = float(df['GOLD_close'].iloc[-1])
        current_atr = float(df['BTC_ATR'].iloc[-1])
        btc_gold_corr = float(df['BTC_GOLD_Corr'].iloc[-1])
        btc_eth_corr = float(df['BTC_ETH_Corr'].iloc[-1])

        news_headlines = cls._fetch_news_headlines()

        # Run Deep Learning Inference
        result = model_loader.run_inference(
            scaled_sequence=latest_sequence,
            news_headlines=news_headlines,
            current_price=current_btc_price,
            current_atr=current_atr,
            btc_gold_corr=btc_gold_corr,
            btc_eth_corr=btc_eth_corr
        )

        # Add feature snapshot details
        result["features"] = {
            "btcClose": current_btc_price,
            "ethClose": current_eth_price,
            "goldClose": current_gold_price,
            "btcVolume": float(df['BTC_volume'].iloc[-1]),
            "btcVol20": float(df['BTC_Vol'].iloc[-1]),
            "btcAtr14": current_atr,
            "btcEthCorr": btc_eth_corr,
            "btcGoldCorr": btc_gold_corr,
        }

        # Store to DB if session provided
        if db is not None:
            try:
                record = PredictionRecord(
                    current_btc=result["currentPrice"],
                    predicted_btc=result["predictedPrice"],
                    change_percent=result["changePercent"],
                    direction=result["direction"],
                    target_h1=result["targetH1"],
                    target_h24=result["targetH24"],
                    stop_loss=result["stopLoss"],
                    rr_ratio=result["rrRatio"],
                    eth_price=current_eth_price,
                    gold_price=current_gold_price,
                    timeframe="1h",
                    model_version="FocusedBTC_Transformer" if result["is_real_model"] else "Baseline Heuristic"
                )
                db.add(record)
                await db.commit()
                await db.refresh(record)
                result["predictionId"] = record.id
                result["timestamp"] = record.timestamp.isoformat()
            except Exception as e:
                print(f"Error persisting prediction to DB: {e}")

        return result
