"""Backend configuration management"""

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    environment: str = "development"
    
    # TTS
    tts_model: str = "speecht5_tts"
    use_gpu: bool = True
    cache_enabled: bool = True
    cache_dir: str = "./audio_cache"
    
    # Rate Limiting
    rate_limit: str = "30/minute"
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
