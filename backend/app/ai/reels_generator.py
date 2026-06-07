import json
import google.generativeai as genai
from app.core.config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-pro"

def generate_reel_script(artisan_data: dict, product_data: dict, story_text: str = "") -> dict:
    """
    Generates a storyboard script for a 30-60 second social media reel.
    Returns dict with 'scenes' (list of scene dicts) and 'music_style'.
    """
    if not settings.GEMINI_API_KEY:
        return {
            "scenes": [
                {"scene": 1, "duration": "3s", "visual": "Close-up of artisan's hands weaving", "on_screen_text": f"Meet {artisan_data.get('name', 'an artisan')}...", "voiceover": "Every thread tells a story."},
                {"scene": 2, "duration": "5s", "visual": f"Wide shot of {artisan_data.get('location', 'the weaving village')}", "on_screen_text": f"{artisan_data.get('location', 'India')}", "voiceover": "From the heart of India's heritage."},
                {"scene": 3, "duration": "10s", "visual": "Detail shots of product motifs and patterns", "on_screen_text": product_data.get('title', 'Handcrafted Beauty'), "voiceover": f"Crafted in {product_data.get('material', 'finest materials')}."},
                {"scene": 4, "duration": "5s", "visual": "Artisan smiling with finished product", "on_screen_text": "Shop Now on WeaveTales", "voiceover": "Own a piece of living history."}
            ],
            "music_style": "Soft instrumental Indian classical fusion"
        }

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
You are a viral social media content creator and video director specializing in cultural storytelling.

Create a storyboard script for a 30-45 second Instagram/YouTube Reel about this handloom product.

Artisan: {artisan_data.get('name')}, {artisan_data.get('location')}, {artisan_data.get('years_of_experience')} years experience
Product: {product_data.get('title')} — {product_data.get('material')}
Story excerpt: {story_text[:200] if story_text else 'A heritage craft made with love'}

Requirements:
- Strong hook in first 3 seconds (curiosity or emotion).
- 4-5 scenes total, each with: scene number, duration (seconds), visual description, on-screen text, voiceover line.
- End with a clear call to action (visit WeaveTales AI).
- music_style: Suggest appropriate background music style.

Return ONLY valid JSON with keys:
"scenes": array of objects with keys "scene" (int), "duration" (string like "5s"), "visual" (string), "on_screen_text" (string), "voiceover" (string)
"music_style": string

No markdown, no code blocks.
"""
        response = model.generate_content(prompt)
        text = response.text.strip().strip("```json").strip("```").strip()
        result = json.loads(text)
        return {
            "scenes": result.get("scenes", []),
            "music_style": result.get("music_style", "Soft Indian classical fusion")
        }
    except Exception as e:
        print(f"Reel Generator Error: {e}")
        return {
            "scenes": [
                {"scene": 1, "duration": "3s", "visual": "Close-up of weaving loom", "on_screen_text": "A thread. A dream.", "voiceover": "Every masterpiece begins the same way."},
                {"scene": 2, "duration": "8s", "visual": "Artisan at work", "on_screen_text": artisan_data.get('name', ''), "voiceover": f"{artisan_data.get('years_of_experience', '')} years of mastery."},
                {"scene": 3, "duration": "10s", "visual": "Product hero shot", "on_screen_text": product_data.get('title', ''), "voiceover": "Wear a piece of India's soul."},
                {"scene": 4, "duration": "4s", "visual": "WeaveTales logo", "on_screen_text": "Shop WeaveTales AI", "voiceover": "Discover your story."}
            ],
            "music_style": "Indian classical sitar fusion, slow tempo"
        }
