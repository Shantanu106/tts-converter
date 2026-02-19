"""
Example: Testing the TTS API
This script demonstrates how to use the TTS API programmatically
"""

import requests
import json
from pathlib import Path

# API base URL
API_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("🏥 Testing health check...")
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_get_voices():
    """Get available voices"""
    print("\n🎤 Getting available voices...")
    response = requests.get(f"{API_URL}/voices")
    voices = response.json()
    print(f"Status: {response.status_code}")
    print(f"Available voices:")
    for voice in voices:
        print(f"  - {voice['name']} ({voice['language']}): {voice['id']}")
    return voices

def test_synthesize(text: str, voice: str = "default", speed: float = 1.0):
    """Test synthesis endpoint"""
    print(f"\n🎵 Synthesizing: '{text}'")
    print(f"Voice: {voice}, Speed: {speed}x")
    
    response = requests.post(
        f"{API_URL}/synthesize",
        json={
            "text": text,
            "voice": voice,
            "speed": speed,
            "language": "en"
        }
    )
    
    if response.status_code == 200:
        # Save audio file
        output_path = Path("test_output.wav")
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Audio saved: {output_path}")
        return True
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.json())
        return False

def test_cache_stats():
    """Get cache statistics"""
    print("\n📊 Getting cache statistics...")
    response = requests.get(f"{API_URL}/cache-stats")
    stats = response.json()
    print(f"Cached files: {stats['cached_files']}")
    print(f"Cache size: {stats['cache_size_mb']:.2f} MB")
    return stats

if __name__ == "__main__":
    print("=" * 50)
    print("TTS Converter API - Test Suite")
    print("=" * 50)
    
    try:
        # Test health
        if not test_health():
            print("❌ Backend is not running!")
            exit(1)
        
        # Get voices
        voices = test_get_voices()
        
        # Synthesize speech
        if test_synthesize("Hello, this is a test of the text-to-speech system."):
            print("✅ Synthesis successful!")
        
        # Test with different speed
        test_synthesize("This is faster speech.", speed=1.5)
        
        # Get cache stats
        test_cache_stats()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to backend at", API_URL)
        print("Make sure the backend is running:")
        print("  cd backend && python main.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
