from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class KlineItem(BaseModel):
    time: int = Field(..., description="UNIX timestamp in seconds")
    open: float
    high: float
    low: float
    close: float
    volume: float

class KlineResponse(BaseModel):
    symbol: str
    interval: str
    data: List[KlineItem]

class TickerResponse(BaseModel):
    symbol: str
    currentPrice: float
    priceChange: float
    priceChangePercent: float
    high24h: float
    low24h: float
    volume24h: float
    quoteVolume24h: Optional[float] = 0.0
    timestamp: int

class GoldResponse(BaseModel):
    symbol: str
    currentPrice: float
    changePercent: float
    source: str
    timestamp: int

class PredictionRequest(BaseModel):
    timeframe: Optional[str] = "1h"

class FeaturesSnapshot(BaseModel):
    btcClose: float
    ethClose: float
    goldClose: float
    btcVolume: float
    btcVol20: float
    btcAtr14: float
    btcEthCorr: float
    btcGoldCorr: float

class PredictionResponse(BaseModel):
    predictionId: Optional[int] = None
    is_real_model: bool
    model_status: str
    currentPrice: float
    predictedPrice: float
    changePercent: float
    direction: str
    targetH1: float
    targetH24: float
    stopLoss: float
    rrRatio: float
    h1_median_return: float
    h24_median_return: float
    btc_gold_corr: float
    btc_eth_corr: float
    features: FeaturesSnapshot
    timestamp: Optional[str] = None

class PredictionHistoryRecord(BaseModel):
    id: int
    timestamp: datetime
    current_btc: float
    predicted_btc: float
    change_percent: float
    direction: str
    target_h1: Optional[float] = None
    target_h24: Optional[float] = None
    stop_loss: Optional[float] = None
    rr_ratio: Optional[float] = None
    eth_price: float
    gold_price: float
    timeframe: str
    model_version: str

    class Config:
        from_attributes = True
