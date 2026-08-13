import httpx
from typing import List, Dict, Any, Optional

ALLOWED_INTERVALS = {"1m", "15m", "1h"}
BINANCE_BASE_URL = "https://api.binance.com/api/v3"

class BinanceService:
    @staticmethod
    async def get_klines(symbol: str = "BTCUSDT", interval: str = "1m", limit: int = 100) -> List[Dict[str, Any]]:
        if interval not in ALLOWED_INTERVALS:
            raise ValueError(f"Invalid interval: '{interval}'. Allowed intervals are: {', '.join(ALLOWED_INTERVALS)}")
        
        limit = max(1, min(limit, 1000))
        url = f"{BINANCE_BASE_URL}/klines"
        params = {
            "symbol": symbol.upper(),
            "interval": interval,
            "limit": limit
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            raw_klines = response.json()

        formatted_klines = []
        for kline in raw_klines:
            formatted_klines.append({
                "time": int(kline[0] / 1000),  # UNIX timestamp in seconds
                "open": round(float(kline[1]), 2),
                "high": round(float(kline[2]), 2),
                "low": round(float(kline[3]), 2),
                "close": round(float(kline[4]), 2),
                "volume": round(float(kline[5]), 4)
            })

        return formatted_klines

    @staticmethod
    async def get_ticker_24hr(symbol: str = "BTCUSDT") -> Dict[str, Any]:
        url = f"{BINANCE_BASE_URL}/ticker/24hr"
        params = {"symbol": symbol.upper()}

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        return {
            "symbol": data.get("symbol"),
            "currentPrice": round(float(data.get("lastPrice", 0)), 2),
            "priceChange": round(float(data.get("priceChange", 0)), 2),
            "priceChangePercent": round(float(data.get("priceChangePercent", 0)), 2),
            "high24h": round(float(data.get("highPrice", 0)), 2),
            "low24h": round(float(data.get("lowPrice", 0)), 2),
            "volume24h": round(float(data.get("volume", 0)), 2),
            "quoteVolume24h": round(float(data.get("quoteVolume", 0)), 2),
            "timestamp": int(data.get("closeTime", 0) / 1000)
        }
