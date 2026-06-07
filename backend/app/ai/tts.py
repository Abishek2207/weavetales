from gtts import gTTS
import os
import uuid

AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

def generate_story_audio(text: str, lang: str = "en") -> str:
    """Convert story text to speech and return the relative URL path."""
    filename = f"story_{uuid.uuid4().hex[:12]}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)
    
    tts = gTTS(text=text, lang=lang, slow=False)
    tts.save(filepath)
    
    return f"/static/audio/{filename}"
