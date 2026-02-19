# Stage 1: Backend builder
FROM python:3.11-slim as backend-builder

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Frontend builder
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY frontend/ .

# Build frontend
RUN npm run build

# Stage 3: Production runtime
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=backend-builder /root/.local /root/.local

# Set PATH
ENV PATH=/root/.local/bin:$PATH

# Copy backend code
COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set working directory
WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Health check (use PORT if provided by the platform)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import os, http.client; p=int(os.environ.get('PORT', '8000')); conn=http.client.HTTPConnection('localhost', p); conn.request('GET','/health'); r=conn.getresponse(); raise SystemExit(0 if r.status==200 else 1)"

# Run the application binding to the platform-provided PORT (default 8000)
# Use shell form so environment substitution works at runtime
CMD sh -c "python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
