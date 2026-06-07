import json
import google.generativeai as genai
from app.core.config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-pro"

def generate_product_description(raw_notes: str, material: str = "", weave_type: str = "") -> dict:
    """
    Generates an SEO-optimized product description from artisan's raw notes.
    Returns dict: title, features (list), description, keywords (list).
    """
    if not settings.GEMINI_API_KEY:
        return {
            "title": f"Handcrafted {material or 'Textile'} — Artisan Heritage Piece",
            "features": ["100% handcrafted", "Heritage weaving technique", "Natural materials"],
            "description": f"A beautifully crafted {material or 'textile'} made by skilled Indian artisans. {raw_notes}",
            "keywords": ["handloom", "handcrafted", "Indian textile", "artisan", material.lower() if material else "fabric"]
        }

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
You are an expert e-commerce copywriter specializing in luxury Indian textiles.
Create a premium product listing from the raw artisan notes below.

Raw Artisan Notes: {raw_notes}
Material: {material}
Weave Type / Craft: {weave_type}

Rules:
- Title: Catchy, evocative, max 10 words.
- Features: Exactly 5 bullet points highlighting craftsmanship, material, and uniqueness.
- Description: 3 concise sentences, premium and persuasive tone. Mention heritage and effort.
- Keywords: 6 SEO-friendly terms (mix of broad and specific).

Return ONLY valid JSON with keys: "title" (string), "features" (array of 5 strings), "description" (string), "keywords" (array of 6 strings).
No markdown, no code blocks.
"""
        response = model.generate_content(prompt)
        text = response.text.strip().strip("```json").strip("```").strip()
        result = json.loads(text)
        return {
            "title": result.get("title", "Handcrafted Heritage Textile"),
            "features": result.get("features", []),
            "description": result.get("description", ""),
            "keywords": result.get("keywords", [])
        }
    except Exception as e:
        print(f"Product Description Error: {e}")
        return {
            "title": f"Handcrafted {weave_type or material} — Heritage Piece",
            "features": ["100% handcrafted by skilled artisans", "Premium natural materials", "Heritage weaving technique", "Unique motifs", "Ethically sourced"],
            "description": f"A masterpiece of Indian craftsmanship. {raw_notes}",
            "keywords": ["handloom", "handcrafted", weave_type.lower() if weave_type else "textile"]
        }
