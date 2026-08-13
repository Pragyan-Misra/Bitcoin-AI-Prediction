from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.session import get_db
from app.database.models import PredictionRecord
from app.services.prediction_service import PredictionService
from app.schemas.prediction import PredictionResponse, PredictionHistoryRecord

router = APIRouter(tags=["AI Prediction Engine"])

@router.post("/api/predict", response_model=PredictionResponse, summary="Run Deep Learning Bitcoin Price Prediction")
async def run_prediction(db: AsyncSession = Depends(get_db)):
    """
    Gathers current BTC, ETH, and Gold market data, builds 60-step rolling sequences,
    preprocesses features matching the trained model, runs PyTorch model inference,
    and stores prediction history.
    """
    try:
        result = await PredictionService.generate_prediction(db=db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction inference failed: {str(e)}")

@router.get("/api/predictions/history", response_model=List[PredictionHistoryRecord], summary="Get Historical Prediction Logs")
async def get_prediction_history(
    limit: int = Query(20, ge=1, le=100, description="Max history logs to return"),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves the most recent Bitcoin price prediction records stored in the database.
    """
    try:
        stmt = select(PredictionRecord).order_by(PredictionRecord.timestamp.desc()).limit(limit)
        result = await db.execute(stmt)
        records = result.scalars().all()
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch prediction history: {str(e)}")
