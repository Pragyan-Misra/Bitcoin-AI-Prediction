import os
import torch
import numpy as np
from app.model.architecture import FocusedBTC_Transformer, FinBERTExtractor, device

class ModelLoaderService:
    def __init__(self):
        self.model = None
        self.finbert = FinBERTExtractor()
        self.is_loaded = False
        self.checkpoint_path = os.getenv(
            "MODEL_PATH",
            os.path.join(os.path.dirname(__file__), "saved_models", "blackrock_beater_best.pth")
        )
        self._init_model()

    def _init_model(self):
        try:
            self.model = FocusedBTC_Transformer(num_numeric_features=12).to(device)
            if os.path.exists(self.checkpoint_path):
                print(f"⚡ Loading PyTorch model checkpoint from: {self.checkpoint_path}")
                state_dict = torch.load(self.checkpoint_path, map_location=device)
                self.model.load_state_dict(state_dict)
                self.model.eval()
                self.is_loaded = True
                print("✅ PyTorch FocusedBTC_Transformer Model successfully initialized.")
            else:
                print(f"⚠️ Model file missing at: {self.checkpoint_path}")
                print("   Place your trained 'blackrock_beater_best.pth' into backend/app/model/saved_models/")
                self.is_loaded = False
        except Exception as e:
            print(f"❌ Failed to load PyTorch model: {e}")
            self.is_loaded = False

    def reload(self):
        self._init_model()
        return self.is_loaded

    def run_inference(self, scaled_sequence: np.ndarray, news_headlines: list, current_price: float, current_atr: float, btc_gold_corr: float, btc_eth_corr: float):
        """
        Runs deep learning inference if model file exists, else calculates baseline heuristic prediction.
        scaled_sequence: shape (60, 12) numpy array
        returns dict with H1 & H24 target predictions, changePercent, direction, stopLoss, R:R ratio, and model_status.
        """
        if self.is_loaded and self.model is not None:
            try:
                # Prepare PyTorch Tensors
                seq_tensor = torch.tensor(scaled_sequence, dtype=torch.float32).unsqueeze(0).to(device)
                sent_vector = self.finbert.extract_features(news_headlines)

                self.model.eval()
                with torch.no_grad():
                    preds = self.model(seq_tensor, sent_vector)

                h1_preds = preds['H1'][0].cpu().numpy()  # [p10, median, p90]
                h24_preds = preds['H24'][0].cpu().numpy()  # [p10, median, p90]

                h1_med = float(h1_preds[1])
                h1_p10 = float(h1_preds[0])
                h1_p90 = float(h1_preds[2])

                h24_med = float(h24_preds[1])

                predicted_price = current_price * (1.0 + h1_med)
                change_percent = h1_med * 100.0

                if h1_med > 0.001:
                    direction = "UP"
                    raw_sl = current_price * (1.0 + h1_p10)
                    atr_sl = current_price - (current_atr * 1.2)
                    stop_price = max(raw_sl, atr_sl)
                    risk = current_price - stop_price
                    reward = predicted_price - current_price
                    rr_ratio = reward / (risk + 1e-8)
                elif h1_med < -0.001:
                    direction = "DOWN"
                    raw_sl = current_price * (1.0 + h1_p90)
                    atr_sl = current_price + (current_atr * 1.2)
                    stop_price = min(raw_sl, atr_sl)
                    risk = stop_price - current_price
                    reward = current_price - predicted_price
                    rr_ratio = reward / (risk + 1e-8)
                else:
                    direction = "NEUTRAL"
                    stop_price = current_price
                    rr_ratio = 1.0

                return {
                    "is_real_model": True,
                    "model_status": "Active Deep Learning Transformer (FocusedBTC_Transformer)",
                    "currentPrice": round(current_price, 2),
                    "predictedPrice": round(predicted_price, 2),
                    "changePercent": round(change_percent, 2),
                    "direction": direction,
                    "targetH1": round(predicted_price, 2),
                    "targetH24": round(current_price * (1.0 + h24_med), 2),
                    "stopLoss": round(stop_price, 2),
                    "rrRatio": round(rr_ratio, 2),
                    "h1_median_return": round(h1_med, 6),
                    "h24_median_return": round(h24_med, 6),
                    "btc_gold_corr": round(btc_gold_corr, 4),
                    "btc_eth_corr": round(btc_eth_corr, 4),
                }
            except Exception as e:
                print(f"Error during PyTorch inference: {e}")

        # Fallback heuristic prediction if model file is not present yet
        # Calculated from recent momentum & technical features in the scaled array
        recent_btc_ret = float(scaled_sequence[-1, 1]) - float(scaled_sequence[-2, 1])
        h1_med = np.clip(recent_btc_ret * 0.05, -0.02, 0.02)
        predicted_price = current_price * (1.0 + h1_med)
        change_percent = h1_med * 100.0

        if h1_med > 0.0005:
            direction = "UP"
            stop_price = current_price - (current_atr * 1.2)
        elif h1_med < -0.0005:
            direction = "DOWN"
            stop_price = current_price + (current_atr * 1.2)
        else:
            direction = "NEUTRAL"
            stop_price = current_price

        return {
            "is_real_model": False,
            "model_status": f"Model file missing ({self.checkpoint_path}). Place blackrock_beater_best.pth in backend/app/model/saved_models/",
            "currentPrice": round(current_price, 2),
            "predictedPrice": round(predicted_price, 2),
            "changePercent": round(change_percent, 2),
            "direction": direction,
            "targetH1": round(predicted_price, 2),
            "targetH24": round(predicted_price * 1.005, 2),
            "stopLoss": round(stop_price, 2),
            "rrRatio": 1.5,
            "h1_median_return": round(h1_med, 6),
            "h24_median_return": round(h1_med * 1.5, 6),
            "btc_gold_corr": round(btc_gold_corr, 4),
            "btc_eth_corr": round(btc_eth_corr, 4),
        }

model_loader = ModelLoaderService()
