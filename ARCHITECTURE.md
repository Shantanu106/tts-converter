# TTS Converter - Architecture & Implementation Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Client Browser                                 │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ React SPA (Vite + TypeScript)                                    │   │
│  │ - TextInput Component (1000 char limit)                          │   │
│  │ - VoiceSelector (dropdown with voice list)                       │   │
│  │ - SpeedControl (0.5x - 2.0x slider)                              │   │
│  │ - AudioControls (play/pause/download/share)                      │   │
│  │ - Waveform Visualization (wavesurfer.js)                         │   │
│  │ - HistoryPanel (localStorage, last 50)                           │   │
│  │ - Dark/Light Mode Toggle                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────┬──────────────────────────────────────────────┘
                          │ HTTP/REST
                          │ Axios Client
                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Reverse Proxy (Optional)                         │
│                    Nginx (Port 80/443)                                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ - SSL/TLS Termination                                            │   │
│  │ - Static File Serving (frontend/dist)                            │   │
│  │ - Request Routing (/api -> backend)                              │   │
│  │ - Streaming Support (large audio files)                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────┬──────────────────────────────────────────────┘
                          │ HTTP/REST
                          │ FastAPI Endpoints
                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend (Python)                            │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ main.py - FastAPI Application                                    │   │
│  │  ├─ GET /health           - Health check                         │   │
│  │  ├─ GET /voices           - Available voices list                │   │
│  │  ├─ POST /synthesize      - Text-to-speech conversion            │   │
│  │  ├─ GET /cache-stats      - Cache information                    │   │
│  │  └─ POST /clear-cache     - Clear audio cache                    │   │
│  │                                                                   │   │
│  │ Middleware:                                                       │   │
│  │  ├─ CORS Configuration                                            │   │
│  │  └─ Rate Limiting (30 req/min per IP)                             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────┬──────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ TTS Engine      │ │ Cache Manager    │ │ Model Loader    │
│ (tts_engine.py) │ │ (File-based)     │ │ (HuggingFace)   │
│                 │ │                  │ │                 │
│ - Text Input    │ │ - MD5 hash key   │ │ - SpeechT5      │
│ - Preprocessing │ │ - Cache lookup   │ │ - HiFi-GAN      │
│ - Model Inference│ │ - File storage   │ │ - GPU/CPU       │
│ - Speed Adjust  │ │ - Expiry (30d)   │ │ - Async Loading │
│ - Audio Output  │ │ - Statistics     │ │                 │
└────────┬────────┘ └──────────────────┘ └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Hugging Face Transformers & PyTorch                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Model: microsoft/speecht5_tts                                    │   │
│  │  - Tokenizer: SpeechT5Tokenizer                                  │   │
│  │  - Model: SpeechT5ForTextToSpeech (256M params)                  │   │
│  │  - Input: Text tokens                                            │   │
│  │  - Output: Mel-spectrogram                                       │   │
│  │                                                                   │   │
│  │ Vocoder: microsoft/speecht5_hifigan                              │   │
│  │  - Input: Mel-spectrogram from TTS                               │   │
│  │  - Output: Waveform (16kHz PCM audio)                            │   │
│  │  - Quality: High-fidelity neural vocoding                        │   │
│  │                                                                   │   │
│  │ Hardware:                                                         │   │
│  │  - GPU: NVIDIA CUDA 11.8+ (optional)                             │   │
│  │  - CPU: Fallback (slower)                                        │   │
│  │  - Auto-detection at startup                                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Storage                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ File System:                                                     │   │
│  │  - ./models/            - Downloaded model checkpoints           │   │
│  │  - ./audio_cache/       - Generated audio WAV files              │   │
│  │  - ./temp_audio/        - Temporary processing files             │   │
│  │                                                                   │   │
│  │ LocalStorage (Browser):                                          │   │
│  │  - Generation history (50 most recent)                           │   │
│  │  - Dark mode preference                                          │   │
│  │  - User settings                                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Input Flow
```
User Types Text
    ↓
TextInput validates (max 1000 chars)
    ↓
User selects voice from VoiceSelector
    ↓
User adjusts speed with SpeedControl
    ↓
User clicks "Generate Speech" button
    ↓
Frontend shows LoadingSpinner
```

### 2. API Request Flow
```
Frontend sends POST /synthesize
    ├─ text: string (validated)
    ├─ voice: string (voice ID)
    ├─ speed: float (0.5-2.0)
    └─ language: string (default: "en")
        ↓
Backend receives request
    ├─ Validates input
    ├─ Checks rate limit
    └─ Computes cache key (MD5 of text + voice + speed)
        ↓
Cache lookup
    ├─ Cache HIT: Return cached audio file
    └─ Cache MISS: Generate new audio
        ↓
Text Processing
    ├─ Strip whitespace
    ├─ Tokenize text
    └─ Create input tensor
        ↓
Model Inference
    ├─ Load speaker embedding (voice-specific)
    ├─ Generate mel-spectrogram
    └─ Vocoder converts to waveform
        ↓
Post-Processing
    ├─ Adjust speed (time-stretch)
    ├─ Normalize audio
    └─ Save as WAV (16-bit, 16kHz)
        ↓
Cache Storage
    ├─ Save to audio_cache/
    └─ File name = cache_key.wav
        ↓
Backend returns FileResponse
    ├─ Media type: audio/wav
    └─ Streaming (large file support)
        ↓
Frontend receives audio
    ├─ Create Blob URL
    └─ Update audioUrl state
        ↓
Waveform loads audio
    ├─ Initialize wavesurfer
    ├─ Render waveform
    └─ Enable play controls
        ↓
User can Play/Pause/Download/Share
```

### 3. Caching Strategy
```
Cache Key = MD5(text + voice + speed + language)

Example:
  Input:
    text = "Hello world"
    voice = "default"
    speed = 1.0
    language = "en"
  
  Key = MD5("Hello worlddefault1.0en")
      = "a1b2c3d4e5f6..."
  
  File = audio_cache/a1b2c3d4e5f6....wav

Cache Metrics:
  - Hit Ratio: ~70% for common phrases
  - TTL: 30 days (can be configured)
  - Size Limit: Optional (no hard limit by default)
  - Invalidation: Manual via /clear-cache endpoint
```

## Technology Stack Details

### Backend
```
Framework: FastAPI (0.104.1)
├─ ASGI Application
├─ Async/await support
├─ Auto-generated API docs (Swagger UI)
├─ Request/response validation
└─ Built-in OpenAPI support

ASGI Server: Uvicorn (0.24.0)
├─ Production WSGI server
├─ Supports streaming responses
├─ Worker processes
└─ Hot reload (development)

Python Packages:
├─ torch (2.1.0) - Deep learning framework
├─ torchaudio (2.1.0) - Audio processing
├─ transformers (4.35.2) - Model hub access
│   ├─ SpeechT5ForTextToSpeech
│   ├─ SpeechT5Processor
│   └─ SpeechT5HifiGan
├─ numpy (1.24.3) - Numerical computing
├─ scipy (1.11.4) - Scientific computing
├─ slowapi (0.1.9) - Rate limiting
└─ pydantic (2.5.0) - Data validation

Models:
├─ microsoft/speecht5_tts
│   ├─ Size: ~256M parameters
│   ├─ Inputs: Text (tokens)
│   ├─ Outputs: Mel-spectrogram (80 channels, 25ms frames)
│   └─ Speed: ~2-5 sec for 15-20 words on GPU
│
└─ microsoft/speecht5_hifigan
    ├─ Size: ~16M parameters
    ├─ Inputs: Mel-spectrogram
    ├─ Outputs: 16kHz PCM audio
    └─ Quality: High-fidelity vocoding
```

### Frontend
```
Framework: React 18 (18.2.0)
├─ Functional components with hooks
├─ State management (useState, useEffect)
├─ Context API (optional for scaling)
└─ Concurrent rendering

Build Tool: Vite (5.0.8)
├─ ES modules only
├─ Hot module replacement (HMR)
├─ Optimized production build
├─ ~100KB initial bundle
└─ Instant server start

Language: TypeScript (5.2.2)
├─ Strict type checking
├─ Interface definitions
├─ Type-safe component props
└─ Better IDE support

Styling: Tailwind CSS (3.3.6)
├─ Utility-first CSS framework
├─ Dark mode support (@apply directive)
├─ Responsive design
└─ PurgeCSS for production

UI Components:
├─ TextInput - Auto-resizing textarea
├─ VoiceSelector - Dropdown with voice list
├─ SpeedControl - Slider with visual feedback
├─ AudioControls - Play/pause/download/share buttons
├─ Waveform - Interactive audio visualization
├─ HistoryPanel - Slide-out history panel
├─ Alert - Toast-like notifications
└─ LoadingSpinner - Animated loader

Audio Visualization: wavesurfer.js (7.0.0)
├─ Interactive waveform rendering
├─ Real-time playback visualization
├─ Seek functionality
├─ Multiple color schemes
└─ Responsive canvas rendering

HTTP Client: Axios (1.6.0)
├─ Promise-based
├─ Request/response interceptors
├─ Automatic JSON serialization
├─ Blob support for audio
└─ Timeout handling

Icons: lucide-react (0.292.0)
├─ Tree-shakeable
├─ SVG icons
├─ Light-weight
└─ Consistent design
```

### Deployment
```
Container: Docker
├─ Multi-stage builds (minimal final image)
├─ Python 3.11-slim base
├─ Only prod dependencies in final image
└─ ~1.5GB total image size

Orchestration: Docker Compose (3.8)
├─ Backend service definition
├─ Frontend dev service (optional)
├─ Nginx proxy service (optional)
├─ Development & production profiles
└─ Network isolation

Reverse Proxy: Nginx (alpine)
├─ SSL/TLS termination
├─ Static file serving
├─ Request routing
├─ Compression (gzip)
├─ Connection pooling
└─ Health checks

Monitoring:
├─ Health endpoint (/health)
├─ Structured logging
├─ Performance metrics
└─ Error tracking
```

## Performance Characteristics

### Latency
```
Cache Hit:
  - Lookup: ~5ms
  - Transfer: depends on audio size (~500ms for 30s)
  - Total: ~600ms

Cache Miss (GPU):
  - Text processing: ~50ms
  - Model inference: ~1-3s
  - Vocoding: ~0.5-1s
  - Audio save: ~50ms
  - Transfer: ~500ms
  - Total: ~2-4.5 seconds

CPU Fallback:
  - Add ~3-5x time
  - Total: ~8-20 seconds
```

### Memory Usage
```
GPU (NVIDIA RTX 3080):
  - Model weights: ~800MB VRAM
  - Inference buffer: ~200MB VRAM
  - Total: ~1GB VRAM

CPU:
  - Model weights: ~1GB RAM
  - Inference buffer: ~500MB RAM
  - Total: ~4-6GB RAM
```

### Throughput
```
Concurrent Requests (GPU):
  - Queue depth: 5-10 (batch size = 1)
  - Throughput: ~15-20 req/min
  - Limited by synthesis time

Concurrent Requests (CPU):
  - Queue depth: 1-2
  - Throughput: ~4-6 req/min
  - CPU bound
```

## Security Implementation

### Input Validation
```
Text Input:
  - Max 1000 characters (enforced)
  - Type validation (string)
  - Whitespace trimming
  - No code execution risks

Voice Selection:
  - Whitelist validation
  - Only predefined voices allowed
  - Case-insensitive matching

Speed Control:
  - Range validation (0.5 - 2.0)
  - Float precision (0.1 step)
  - Clamping (min/max limits)
```

### Rate Limiting
```
Strategy: IP-based rate limiting
Rate: 30 requests per minute per IP
Bypass: X-Forwarded-For header aware
Enforcement: Via slowapi middleware
Response: 429 Too Many Requests
```

### CORS Configuration
```
Allowed Origins:
  - http://localhost:5173 (dev frontend)
  - http://localhost:3000 (alt frontend)
  - http://127.0.0.1:5173
  - * (can be restricted in production)

Methods: GET, POST, OPTIONS
Headers: Content-Type, Authorization
Credentials: Disabled by default
```

### Error Handling
```
HTTP Status Codes:
  - 200: Success
  - 400: Bad request (validation error)
  - 429: Rate limit exceeded
  - 500: Server error
  - 503: Service unavailable

Error Response Format:
  {
    "detail": "Error message describing the issue"
  }
```

## Scalability Considerations

### Horizontal Scaling
```
Multiple Backend Instances:
  - Load balance via Nginx round-robin
  - Shared cache directory (NFS)
  - Shared model directory (or each instance loads)
  - Stateless design (no session affinity needed)

Caching Strategy:
  - File-based cache (can be NFS mounted)
  - Redis option (for distributed cache)
  - Cache invalidation policy needed
```

### Vertical Scaling
```
GPU Optimization:
  - Use larger GPU (V100, A100)
  - Enable NVIDIA graph capture
  - Use mixed precision (FP16)
  - Batch multiple requests

CPU Optimization:
  - Use faster CPU (EPYC, Xeon)
  - Increase thread count
  - Use CPU vectorization (AVX2)
  - Pre-compile models (TorchScript)
```

### Cost Optimization
```
Model Optimization:
  - Use quantized models (INT8)
  - Compress mel-spectrogram
  - Cache aggressively
  - Prune low-freq components

Infrastructure:
  - Use spot instances (AWS, GCP)
  - Reserved capacity discounts
  - Idle time shutdown
  - Cost monitoring
```

## Troubleshooting Guide

### Common Issues
```
Issue: CUDA out of memory
Fix:
  1. Set USE_GPU=false
  2. Restart container
  3. Or use smaller GPU model

Issue: Model download fails
Fix:
  1. Check internet connection
  2. Set HF_HOME environment variable
  3. Pre-download model manually
  4. Use model cache

Issue: Slow synthesis
Fix:
  1. Check GPU availability (health endpoint)
  2. Verify cache is working
  3. Monitor CPU/memory usage
  4. Check network latency
```

---

**Last Updated:** 2024
**Version:** 1.0.0
