from fastapi import APIRouter, Query, HTTPException
from app.services.binance_service import BinanceService, ALLOWED_INTERVALS
from app.schemas.prediction import KlineResponse, TickerResponse

router = APIRouter(prefix="/api/bitcoin", tags=["Bitcoin Data"])

@router.get("/klines", response_model=KlineResponse, summary="Get Bitcoin Candlestick (Kline) Data")
async def get_bitcoin_klines(
    interval: str = Query("1m", description="Timeframe interval: 1m, 15m, or 1h"),
    limit: int = Query(100, ge=1, le=1000, description="Number of klines to retrieve (1-1000)")
):
    """
    Fetches real Bitcoin candlestick data from Binance REST API.
    Maps open time, open, high, low, close, and volume into clean numeric arrays.
    """
    if interval not in ALLOWED_INTERVALS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid interval '{interval}'. Allowed timeframes: {', '.join(ALLOWED_INTERVALS)}"
        )

    try:
        data = await BinanceService.get_klines(symbol="BTCUSDT", interval=interval, limit=limit)
        return {
            "symbol": "BTCUSDT",
            "interval": interval,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch Binance kline data: {str(e)}")

@router.get("/ticker", response_model=TickerResponse, summary="Get Live 24h Bitcoin Ticker Data")
async def get_bitcoin_ticker():
    """
    Fetches 24-hour Bitcoin ticker statistics (current price, 24h change %, 24h high/low, volume).
    """
    try:
        return await BinanceService.get_ticker_24hr(symbol="BTCUSDT")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch Binance BTC ticker data: {str(e)}")
