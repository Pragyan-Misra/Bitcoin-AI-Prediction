import torch
import torch.nn as nn
import numpy as np

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class VariableSelectionNetwork(nn.Module):
    def __init__(self, input_size, num_features, hidden_size):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_features = num_features
        self.weight_network = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, num_features),
            nn.Softmax(dim=-1)
        )
        self.feature_networks = nn.ModuleList([
            nn.Linear(1, hidden_size) for _ in range(num_features)
        ])

    def forward(self, x):
        weights = self.weight_network(x)
        weights = weights.unsqueeze(-1)
        processed_features = []
        for i in range(self.num_features):
            feature_column = x[:, :, i:i+1]
            processed = self.feature_networks[i](feature_column)
            processed_features.append(processed)
        stacked_features = torch.stack(processed_features, dim=-2)
        selected_features = torch.sum(stacked_features * weights, dim=-2)
        return selected_features, weights.squeeze(-1)

class FocusedBTC_Transformer(nn.Module):
    def __init__(self, num_numeric_features=12, hidden_size=64, num_heads=4):
        super().__init__()
        self.vsn = VariableSelectionNetwork(num_numeric_features, num_numeric_features, hidden_size)
        self.sentiment_proj = nn.Linear(768, hidden_size)
        self.cross_attention = nn.MultiheadAttention(embed_dim=hidden_size, num_heads=num_heads, batch_first=True)
        self.transformer_layer = nn.TransformerEncoderLayer(d_model=hidden_size, nhead=num_heads, batch_first=True)
        
        self.h1_median = nn.Linear(hidden_size, 1)
        self.h1_spread = nn.Sequential(nn.Linear(hidden_size, 2), nn.ReLU())
        self.h24_median = nn.Linear(hidden_size, 1)
        self.h24_spread = nn.Sequential(nn.Linear(hidden_size, 2), nn.ReLU())

    def forward(self, numeric_x, sentiment_x):
        batch_size, seq_len, _ = numeric_x.shape
        vsn_out, _ = self.vsn(numeric_x)
        
        # Flawlessly handles (batch_size, 768) in BOTH train and live mode
        if sentiment_x.dim() == 2:
            sent_proj = self.sentiment_proj(sentiment_x).unsqueeze(1)
            sent_proj = sent_proj.expand(-1, seq_len, -1)
        else:
            sent_proj = self.sentiment_proj(sentiment_x)
        
        fused_out, _ = self.cross_attention(query=vsn_out, key=sent_proj, value=sent_proj)
        transformer_out = self.transformer_layer(fused_out)
        final_state = transformer_out[:, -1, :]
        
        h1_med = torch.tanh(self.h1_median(final_state)) * 0.03
        h1_spr = torch.tanh(self.h1_spread(final_state)) * 0.03
        h1_p10 = h1_med - h1_spr[:, 0:1]
        h1_p90 = h1_med + h1_spr[:, 1:2]
        
        h24_med = torch.tanh(self.h24_median(final_state)) * 0.15
        h24_spr = torch.tanh(self.h24_spread(final_state)) * 0.15
        h24_p10 = h24_med - h24_spr[:, 0:1]
        h24_p90 = h24_med + h24_spr[:, 1:2]
        
        return {
            'H1': torch.cat([h1_p10, h1_med, h1_p90], dim=-1),
            'H24': torch.cat([h24_p10, h24_med, h24_p90], dim=-1)
        }

class FinBERTExtractor:
    def __init__(self):
        self.model = None
        self.tokenizer = None

    def load_model_if_needed(self):
        if self.model is None:
            try:
                from transformers import AutoTokenizer, AutoModelForSequenceClassification
                self.tokenizer = AutoTokenizer.from_pretrained('ProsusAI/finbert')
                self.model = AutoModelForSequenceClassification.from_pretrained('ProsusAI/finbert').to(device)
                self.model.eval()
            except Exception as e:
                print(f"Warning: FinBERT could not be loaded: {e}. Falling back to zero sentiment embedding.")
                self.model = False

    def extract_features(self, headlines):
        self.load_model_if_needed()
        if not self.model or self.model is False or not headlines:
            return torch.zeros(1, 768).to(device)
        
        try:
            inputs = self.tokenizer(headlines, padding=True, truncation=True, return_tensors='pt', max_length=64).to(device)
            with torch.no_grad():
                outputs = self.model(**inputs, output_hidden_states=True)
                last_hidden_state = outputs.hidden_states[-1]
                sentence_embeddings = last_hidden_state.mean(dim=1)
                aggregated_sentiment = sentence_embeddings.mean(dim=0, keepdim=True)
            return aggregated_sentiment
        except Exception:
            return torch.zeros(1, 768).to(device)
