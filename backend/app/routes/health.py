from fastapi import APIRouter
from app.model.model_loader import model_loader

router = APIRouter(tags=["Health"])

@router.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Bitcoin Price Prediction API",
        "model_loaded": model_loader.is_loaded,
        "model_status": model_loader.run_inference(
            scaled_sequence=None, news_headlines=[], current_price=100.0, current_atr=1.0, btc_gold_corr=0.0, btc_eth_corr=0.0
        )["model_status"] if not model_loader.is_loaded else "PyTorch FocusedBTC_Transformer Active"
    }
