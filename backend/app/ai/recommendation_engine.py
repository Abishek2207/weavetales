import json
import google.generativeai as genai
from app.core.config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-pro"

def get_heritage_recommendations(current_product: dict, all_products: list, user_history: list = []) -> list:
    """
    Recommends products based on cultural/aesthetic links.
    Returns list of dicts: product_id, reason.
    """
    if not all_products or len(all_products) < 2:
        return []

    # Filter out the current product from recommendations
    other_products = [p for p in all_products if p.get("id") != current_product.get("id")]
    if not other_products:
        return []

    if not settings.GEMINI_API_KEY:
        # Simple fallback - return all other products with a generic reason
        return [
            {
                "product_id": p["id"],
                "reason": f"Explore another beautiful handcrafted piece from our artisan collection."
            }
            for p in other_products[:3]
        ]

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        
        products_list = json.dumps([
            {"id": p["id"], "title": p["title"], "material": p["material"], "artisan_location": p.get("artisan", {}).get("location", "")}
            for p in other_products
        ], indent=2)

        user_hist_text = json.dumps(user_history) if user_history else "None"

        prompt = f"""
You are a heritage curator recommending Indian handloom products based on cultural and aesthetic connections.

Current Product the user is viewing:
Title: {current_product.get('title')}
Material: {current_product.get('material')}
Artisan Location: {current_product.get('artisan', {}).get('location', '')}
Craft: {current_product.get('artisan', {}).get('craft', '')}

Other Available Products:
{products_list}

User Browsing History (previously viewed): {user_hist_text}

For each other product, generate a short, curatorial, story-driven reason for recommending it.
Focus on: shared cultural heritage, material affinity, regional connection, aesthetic similarity, or complementary use.

Return ONLY valid JSON: an array of objects with keys "product_id" (int) and "reason" (string, max 20 words, e.g. "Like your Kanjeevaram, this Banarasi celebrates India's gold-thread traditions.").
No markdown, raw JSON only.
"""
        response = model.generate_content(prompt)
        text = response.text.strip().strip("```json").strip("```").strip()
        result = json.loads(text)
        return result if isinstance(result, list) else []
    except Exception as e:
        print(f"Recommendation Error: {e}")
        return [
            {"product_id": p["id"], "reason": "Another exceptional piece from India's handloom heritage."}
            for p in other_products[:3]
        ]
