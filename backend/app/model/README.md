# Deep Learning Model Drop-In Directory

Place your trained PyTorch state dictionary checkpoint file in this folder:

`backend/app/model/saved_models/blackrock_beater_best.pth`

### Model Specification:
- **Architecture**: `FocusedBTC_Transformer` (Variable Selection Network + FinBERT Cross Attention + Transformer Encoder + Multi-horizon Quantile Heads)
- **Input Features (12 Numeric Features)**:
  `['BTC_close', 'BTC_return', 'ETH_close', 'ETH_return', 'GOLD_close', 'GOLD_return', 'BTC_volume', 'BTC_SMA20', 'BTC_Vol', 'BTC_ATR', 'BTC_ETH_Corr', 'BTC_GOLD_Corr']`
- **Sequence Length**: 60 rolling hourly time steps (Shape: `1, 60, 12`)
- **Text Sentiment Vector**: FinBERT 768-dim sentence embedding (Shape: `1, 768`)
- **Outputs**:
  - `H1`: `[p10, median, p90]`
  - `H24`: `[p10, median, p90]`
