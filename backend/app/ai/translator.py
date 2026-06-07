import google.generativeai as genai
from app.core.config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-pro"

SUPPORTED_LANGUAGES = {
    "en": "English", "hi": "Hindi", "ta": "Tamil", "te": "Telugu",
    "kn": "Kannada", "ml": "Malayalam", "bn": "Bengali", "gu": "Gujarati",
    "mr": "Marathi", "pa": "Punjabi", "or": "Odia", "fr": "French",
    "de": "German", "es": "Spanish", "ja": "Japanese", "zh": "Chinese (Simplified)"
}

# Preserve these terms as proper nouns (do not translate literally)
PRESERVE_TERMS = [
    "Kanjeevaram", "Banarasi", "Ikat", "Jamdani", "Patola", "Kantha",
    "Phulkari", "Chanderi", "Maheshwari", "Zari", "Saree", "Dupatta",
    "Kurta", "Dhoti", "Salwar", "Lungi", "WeaveTales", "GI Tag"
]

def translate_text(text: str, target_language_code: str, source_language_code: str = "auto") -> dict:
    """
    Translates text preserving cultural handloom terminology.
    Returns dict with 'translated_text' and 'detected_language'.
    """
    target_lang = SUPPORTED_LANGUAGES.get(target_language_code, target_language_code)
    source_lang = SUPPORTED_LANGUAGES.get(source_language_code, "auto-detect")

    if not settings.GEMINI_API_KEY:
        return {
            "translated_text": f"[Translation to {target_lang}]: {text[:100]}...",
            "detected_language": "English",
            "target_language": target_lang
        }

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        preserve_list = ", ".join(PRESERVE_TERMS)
        prompt = f"""
You are an expert translator specializing in Indian textiles, culture, and literature.

Translate the following text from {source_lang} to {target_lang}.

CRITICAL RULES:
1. Preserve these terms as-is (do not translate, they are proper nouns): {preserve_list}
2. Maintain the emotional resonance and premium tone.
3. If the source language is "auto-detect", first detect the language.
4. Return ONLY the translated text. No explanations, no quotes, just the translation.

Text to translate:
{text}
"""
        response = model.generate_content(prompt)
        translated = response.text.strip()
        
        # Detect source language
        detect_prompt = f"What language is this text written in? Reply with ONLY the language name, nothing else:\n{text[:200]}"
        detect_response = model.generate_content(detect_prompt)
        detected = detect_response.text.strip()

        return {
            "translated_text": translated,
            "detected_language": detected,
            "target_language": target_lang
        }
    except Exception as e:
        print(f"Translation Error: {e}")
        return {
            "translated_text": text,
            "detected_language": "Unknown",
            "target_language": target_lang
        }

def get_supported_languages() -> list:
    return [{"code": k, "name": v} for k, v in SUPPORTED_LANGUAGES.items()]
