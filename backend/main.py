"""
FastAPI backend for Text-to-Speech converter
Production-ready with GPU support, caching, and rate limiting
"""

import os
import json
import hashlib
from pathlib import Path
from typing import Optional, List
import logging

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks, Request
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel, Field
import torch

from tts_engine import TTSEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize app
app = FastAPI(title="TTS Converter API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Initialize TTS engine
tts_engine = TTSEngine()

# Create cache directory
CACHE_DIR = Path("./audio_cache")
CACHE_DIR.mkdir(exist_ok=True)

# Pydantic models
class SynthesizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    voice: str = Field(default="default")
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    language: Optional[str] = Field(default="en")

class VoiceInfo(BaseModel):
    id: str
    name: str
    language: str
    quality: str

class CacheStats(BaseModel):
    cached_files: int
    cache_size_mb: float

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    logger.info("🚀 Starting TTS Converter Backend")
    logger.info(f"🔧 CUDA available: {torch.cuda.is_available()}")
    logger.info(f"📱 Device: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'}")
    
    # Pre-load models
    try:
        await tts_engine.initialize()
        logger.info("✅ TTS models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load TTS models: {e}")
        raise

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "cuda_available": torch.cuda.is_available(),
        "device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
    }

@app.get("/voices", tags=["TTS"])
async def get_voices() -> List[VoiceInfo]:
    """Get list of available voices/languages"""
    try:
        voices = tts_engine.get_available_voices()
        return voices
    except Exception as e:
        logger.error(f"Error getting voices: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/synthesize", tags=["TTS"])
@limiter.limit("30/minute")
async def synthesize(request: Request, data: SynthesizeRequest):
    """
    Generate speech from text
    Returns audio/wav stream
    """
    try:
        # Validate input
        if not data.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        logger.info(f"📝 Synthesizing: {data.text[:50]}... | Voice: {data.voice} | Speed: {data.speed}")
        
        # Generate cache key
        cache_key = hashlib.md5(
            f"{data.text}_{data.voice}_{data.speed}_{data.language}".encode()
        ).hexdigest()
        cache_file = CACHE_DIR / f"{cache_key}.wav"
        
        # Check cache
        if cache_file.exists():
            logger.info(f"✅ Cache hit for {cache_key}")
            return FileResponse(
                path=cache_file,
                media_type="audio/wav",
                filename="speech.wav"
            )
        
        # Generate audio
        audio_path = await tts_engine.synthesize(
            text=data.text,
            voice=data.voice,
            speed=data.speed,
            language=data.language
        )
        
        # Move to cache
        import shutil
        shutil.move(str(audio_path), str(cache_file))
        
        logger.info(f"✅ Generated audio: {cache_file}")
        
        return FileResponse(
            path=cache_file,
            media_type="audio/wav",
            filename="speech.wav"
        )
        
    except Exception as e:
        logger.error(f"Error synthesizing speech: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cache-stats", tags=["Admin"])
async def get_cache_stats() -> CacheStats:
    """Get cache statistics"""
    try:
        files = list(CACHE_DIR.glob("*.wav"))
        total_size = sum(f.stat().st_size for f in files) / (1024 * 1024)
        return CacheStats(
            cached_files=len(files),
            cache_size_mb=total_size
        )
    except Exception as e:
        logger.error(f"Error getting cache stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clear-cache", tags=["Admin"])
async def clear_cache():
    """Clear all cached audio files"""
    try:
        import shutil
        if CACHE_DIR.exists():
            shutil.rmtree(CACHE_DIR)
            CACHE_DIR.mkdir()
        return {"message": "Cache cleared successfully"}
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    return {
        "name": "Text-to-Speech Converter API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "voices": "/voices",
        "endpoints": {
            "synthesize": "POST /synthesize",
            "get_voices": "GET /voices",
            "health_check": "GET /health",
            "cache_stats": "GET /cache-stats",
            "clear_cache": "POST /clear-cache"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False
    )
