import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database.session import init_db
from app.routes import health, bitcoin, ethereum, gold, prediction

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print("🚀 Initializing Database Tables...")
    await init_db()
    print("✅ Application Startup Complete.")
    yield
    # Shutdown actions
    print("🛑 Application Shutdown.")

app = FastAPI(
    title="Bitcoin AI Price Prediction API",
    description="Production-Grade FastAPI service for Deep Learning Bitcoin Price Prediction using Ethereum & Gold data.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration to allow requests from Netlify frontend and local dev environments
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://*.netlify.app",
    "*"  # Allows Netlify preview deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits Netlify SPA client cross-origin requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(health.router)
app.include_router(bitcoin.router)
app.include_router(ethereum.router)
app.include_router(gold.router)
app.include_router(prediction.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
