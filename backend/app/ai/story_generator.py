import json
import google.generativeai as genai
from app.core.config import settings

# Configure Gemini with the API Key
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# Use the Gemini 1.5 Pro model for better reasoning and structured output
MODEL_NAME = "gemini-1.5-pro"

def generate_product_story(artisan_data: dict, product_data: dict) -> dict:
    """
    Generates a culturally rich story for a handloom product.
    Returns a dictionary containing 'generated_text' and 'tags'.
    """
    if not settings.GEMINI_API_KEY:
        # Fallback for hackathon testing if API key is not set
        return {
            "generated_text": f"A beautiful {product_data.get('material', 'piece')} crafted by {artisan_data.get('name', 'an artisan')}. This piece represents generations of skill.",
            "tags": "handcrafted, heritage"
        }

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        
        prompt = f"""
        You are an expert cultural storyteller and luxury brand copywriter.
        Write a compelling, respectful narrative (max 3 paragraphs) about the following handcrafted item.
        
        Artisan Details:
        Name: {artisan_data.get('name')}
        Location: {artisan_data.get('location')}
        Craft: {artisan_data.get('craft')}
        Bio: {artisan_data.get('bio')}
        Years of Experience: {artisan_data.get('years_of_experience')}
        
        Product Details:
        Title: {product_data.get('title')}
        Material: {product_data.get('material')}
        
        Provide the output as a JSON object with two keys:
        1. "generated_text": The story string.
        2. "tags": A comma-separated string of 3-5 relevant keywords (e.g., "100 hours of effort, Sustainable, Ikat").
        
        Ensure the JSON is valid and contains no markdown code block formatting (just raw JSON).
        """
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove any potential markdown formatting from the response
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        result = json.loads(response_text.strip())
        
        return {
            "generated_text": result.get("generated_text", ""),
            "tags": result.get("tags", "")
        }
        
    except Exception as e:
        print(f"Error generating story: {e}")
        return {
            "generated_text": f"A beautiful {product_data.get('material')} handcrafted by {artisan_data.get('name')}.",
            "tags": "error, fallback"
        }
