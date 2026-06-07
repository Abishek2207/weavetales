import json
import google.generativeai as genai
from app.core.config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-flash"  # Using flash for speed on this lightweight task

VALID_EMOTIONS = ["joy", "curiosity", "awe", "nostalgia", "satisfaction", "frustration", "neutral", "trust"]
VALID_SENTIMENTS = ["positive", "negative", "neutral"]

def detect_emotion(text: str) -> dict:
    """
    Detects sentiment and primary emotion from user-generated text.
    Returns dict: sentiment, emotion, confidence, action_flag.
    """
    if not text or len(text.strip()) < 3:
        return {"sentiment": "neutral", "emotion": "neutral", "confidence": 0.5, "action_flag": None}

    if not settings.GEMINI_API_KEY:
        # Simple keyword-based fallback
        text_lower = text.lower()
        if any(w in text_lower for w in ["love", "beautiful", "amazing", "gorgeous", "wonderful"]):
            return {"sentiment": "positive", "emotion": "joy", "confidence": 0.8, "action_flag": None}
        elif any(w in text_lower for w in ["expensive", "bad", "terrible", "hate", "disappoint"]):
            return {"sentiment": "negative", "emotion": "frustration", "confidence": 0.75, "action_flag": "route_to_support"}
        return {"sentiment": "neutral", "emotion": "curiosity", "confidence": 0.6, "action_flag": None}

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
Analyze the sentiment and emotion in this user review/message about a handloom product.

Text: "{text}"

Consider context: words like "expensive" may be positive if followed by "worth it".

Return ONLY valid JSON with these exact keys:
- "sentiment": one of ["positive", "negative", "neutral"]
- "emotion": one of ["joy", "curiosity", "awe", "nostalgia", "satisfaction", "frustration", "neutral", "trust"]
- "confidence": float between 0 and 1
- "action_flag": null OR "route_to_support" (only if clearly frustrated/angry) OR "highlight_review" (if very positive/5-star worthy)
- "insight": one sentence explaining why

No markdown, raw JSON only.
"""
        response = model.generate_content(prompt)
        text_resp = response.text.strip().strip("```json").strip("```").strip()
        result = json.loads(text_resp)
        
        # Validate enums
        sentiment = result.get("sentiment", "neutral")
        emotion = result.get("emotion", "neutral")
        
        return {
            "sentiment": sentiment if sentiment in VALID_SENTIMENTS else "neutral",
            "emotion": emotion if emotion in VALID_EMOTIONS else "neutral",
            "confidence": float(result.get("confidence", 0.5)),
            "action_flag": result.get("action_flag"),
            "insight": result.get("insight", "")
        }
    except Exception as e:
        print(f"Emotion Detection Error: {e}")
        return {"sentiment": "neutral", "emotion": "neutral", "confidence": 0.5, "action_flag": None, "insight": ""}
