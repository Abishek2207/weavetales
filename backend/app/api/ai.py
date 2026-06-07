import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.database import get_db
from app.models.models import Product, Story, User
from app.core.security import get_current_user
from app.core.config import settings
from app.api.schemas import StoryOut, ChatRequest, ChatResponse

router = APIRouter(prefix="/api/ai", tags=["AI"])


def get_model():
    if not settings.GEMINI_API_KEY:
        return None
    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-1.5-flash")


@router.post("/story/{product_id}", response_model=StoryOut)
async def generate_story(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    model = get_model()
    if model:
        prompt = f"""You are WeaveTales AI, a cultural heritage storyteller.
        
        Create a rich, evocative narrative for this handloom product:
        - Product: {product.name}
        - Material: {product.material or 'Traditional fibers'}
        - Technique: {product.technique or 'Traditional weaving'}
        - Region: {product.region_of_origin or 'India'}
        - Description: {product.description or ''}
        
        Generate a JSON object with three keys:
        1. "generated_story": A 3-paragraph poetic story from the perspective of the fabric (200 words)
        2. "cultural_heritage_context": Historical and cultural significance of this weaving tradition (150 words)
        3. "artisan_journey": The artisan's personal journey and craft mastery (100 words)
        
        Return ONLY valid JSON, no markdown."""

        try:
            response = model.generate_content(prompt)
            import json
            text = response.text.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            data = json.loads(text.strip())
            generated_story = data.get("generated_story", "")
            cultural_context = data.get("cultural_heritage_context", "")
            artisan_journey = data.get("artisan_journey", "")
        except Exception:
            generated_story = f"The {product.name} carries within its threads centuries of wisdom..."
            cultural_context = f"This {product.technique} tradition from {product.region_of_origin} represents..."
            artisan_journey = f"Each thread tells the story of the artisan's dedication..."
    else:
        generated_story = f"The {product.name} carries within its threads centuries of wisdom and cultural heritage. Every interlacing fiber speaks of a tradition passed down through generations, where skilled hands transform raw {product.material or 'fiber'} into living art."
        cultural_context = f"The {product.technique or 'weaving'} tradition from {product.region_of_origin or 'India'} is a UNESCO-recognized heritage art form dating back over 2,000 years. This craft represents the soul of its community."
        artisan_journey = f"The artisan behind this piece has dedicated decades to mastering this technique, learning from their ancestors and innovating for the future."

    # Save or update story
    result = await db.execute(select(Story).where(Story.product_id == product_id))
    story = result.scalar_one_or_none()
    if story:
        story.generated_story = generated_story
        story.cultural_heritage_context = cultural_context
        story.artisan_journey = artisan_journey
    else:
        story = Story(
            product_id=product_id,
            generated_story=generated_story,
            cultural_heritage_context=cultural_context,
            artisan_journey=artisan_journey,
        )
        db.add(story)
    await db.commit()
    await db.refresh(story)
    return story


@router.get("/story/{product_id}", response_model=StoryOut)
async def get_story(product_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Story).where(Story.product_id == product_id))
    story = result.scalar_one_or_none()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found. Generate one first.")
    return story


@router.post("/chatbot", response_model=ChatResponse)
async def chat(request: ChatRequest):
    model = get_model()
    if model:
        system = """You are Tāna, the WeaveTales AI Cultural Assistant — a warm, knowledgeable guide 
        specializing in Indian handloom traditions, weaving techniques, cultural heritage, and artisan stories.
        Keep responses concise (under 150 words), engaging, and educational."""
        try:
            response = model.generate_content(f"{system}\n\nUser: {request.message}\nTāna:")
            reply = response.text
        except Exception:
            reply = "Namaste! I'm Tāna, your cultural weaving guide. I'm having trouble connecting right now, but I'm here to share the rich stories behind India's handloom traditions!"
    else:
        replies = {
            "silk": "Silk weaving in India dates back to 2450 BCE! The Kanchipuram silk of Tamil Nadu is especially renowned for its zari (gold thread) work and rich colors.",
            "banarasi": "Banarasi silk is one of India's finest fabrics, known for its fine silk, opulent embroidery and was once the exclusive preserve of royalty.",
            "default": "Namaste! I'm Tāna, your WeaveTales cultural guide. Ask me about Indian weaving traditions — from Banarasi silk to Kantha embroidery, Ikat to Jamdani!"
        }
        msg_lower = request.message.lower()
        reply = next((v for k, v in replies.items() if k in msg_lower), replies["default"])
    return {"reply": reply}
