from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class PredictionRecord(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    current_btc = Column(Float, nullable=False)
    predicted_btc = Column(Float, nullable=False)
    change_percent = Column(Float, nullable=False)
    direction = Column(String(10), nullable=False)
    target_h1 = Column(Float, nullable=True)
    target_h24 = Column(Float, nullable=True)
    stop_loss = Column(Float, nullable=True)
    rr_ratio = Column(Float, nullable=True)
    eth_price = Column(Float, nullable=False)
    gold_price = Column(Float, nullable=False)
    timeframe = Column(String(10), default="1h")
    model_version = Column(String(100), default="FocusedBTC_Transformer v1")
