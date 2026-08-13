from fastapi import APIRouter, HTTPException
from app.services.gold_service import GoldService
from app.schemas.prediction import GoldResponse

router = APIRouter(prefix="/api/gold", tags=["Gold Data"])

@router.get("", response_model=GoldResponse, summary="Get Gold Market Data")
async def get_gold_market_data():
    """
    Fetches real-time Gold market price data using Alpha Vantage API (or market feed fallback).
    Used as an input feature for the Deep Learning prediction model.
    """
    try:
        return await GoldService.get_gold_market_data()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch Gold market data: {str(e)}")
