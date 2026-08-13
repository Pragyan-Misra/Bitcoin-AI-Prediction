from fastapi import APIRouter, HTTPException
from app.services.binance_service import BinanceService
from app.schemas.prediction import TickerResponse

router = APIRouter(prefix="/api/ethereum", tags=["Ethereum Data"])

@router.get("/ticker", response_model=TickerResponse, summary="Get Live 24h Ethereum Ticker Data")
async def get_ethereum_ticker():
    """
    Fetches 24-hour Ethereum ticker statistics (current price, 24h change %, 24h high/low, volume).
    Used as an input feature for the Deep Learning prediction model.
    """
    try:
        return await BinanceService.get_ticker_24hr(symbol="ETHUSDT")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch Binance ETH ticker data: {str(e)}")
