from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.auth import verify_password, create_access_token
from app.models import domain as models
from app.schemas import domain as schemas

# AI Module Imports
from app.ai.story_generator import generate_product_story
from app.ai.cultural_assistant import answer_cultural_query
from app.ai.description_generator import generate_product_description
from app.ai.reels_generator import generate_reel_script
from app.ai.translator import translate_text, get_supported_languages
from app.ai.emotion_detector import detect_emotion
from app.ai.recommendation_engine import get_heritage_recommendations
from app.ai.blockchain import generate_blockchain_hash, verify_blockchain_hash
from app.ai.tts import generate_story_audio

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ─── Request/Response Models ─────────────────────────────────────────────────

class ChatRequest(BaseModel):
    query: str
    conversation_history: Optional[List[dict]] = []
    product_context: Optional[str] = ""

class DescriptionRequest(BaseModel):
    raw_notes: str
    material: Optional[str] = ""
    weave_type: Optional[str] = ""

class TranslateRequest(BaseModel):
    text: str
    target_language_code: str
    source_language_code: Optional[str] = "auto"

class EmotionRequest(BaseModel):
    text: str

class ReelRequest(BaseModel):
    product_id: int

class RecommendRequest(BaseModel):
    product_id: int
    user_history: Optional[List[int]] = []


# ─── Authentication ──────────────────────────────────────────────────────────

@router.post("/auth/login", response_model=schemas.Token, summary="Admin Login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from app.core.auth import decode_access_token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(models.User).filter(models.User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ─── Product & Artisan CRUD ───────────────────────────────────────────────────

@router.get("/artisans/", response_model=List[schemas.Artisan], summary="List all artisans")
def read_artisans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Artisan).offset(skip).limit(limit).all()

@router.post("/artisans/", response_model=schemas.Artisan, summary="Add new artisan (Admin)")
def create_artisan(artisan: schemas.ArtisanCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_artisan = models.Artisan(**artisan.model_dump())
    db.add(db_artisan)
    db.commit()
    db.refresh(db_artisan)
    return db_artisan

@router.get("/products/", response_model=List[schemas.Product], summary="List all products")
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Product).offset(skip).limit(limit).all()

@router.post("/products/", response_model=schemas.Product, summary="Add new product (Admin)")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_product = models.Product(**product.model_dump())
    db_product.blockchain_hash = generate_blockchain_hash(product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/products/{product_id}", response_model=schemas.Product, summary="Get a single product")
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/verify/{blockchain_hash}", summary="Verify Product Blockchain Hash")
def verify_product(blockchain_hash: str):
    return verify_blockchain_hash(blockchain_hash)


# ─── Module 1: Story Generator & TTS ──────────────────────────────────────────

@router.post("/products/{product_id}/generate-story", response_model=schemas.Story, summary="[AI] Generate a cultural story and TTS audio")
def create_product_story(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    existing_story = db.query(models.Story).filter(models.Story.product_id == product_id).first()
    if existing_story:
        return existing_story
    
    artisan_data = {"name": product.artisan.name, "location": product.artisan.location,
                    "craft": product.artisan.craft, "bio": product.artisan.bio,
                    "years_of_experience": product.artisan.years_of_experience}
    product_data = {"title": product.title, "material": product.material, "price": product.price}
    
    ai_result = generate_product_story(artisan_data, product_data)
    story_text = ai_result.get("generated_text", "")
    
    # Generate TTS Audio
    audio_url = generate_story_audio(story_text)
    
    new_story = models.Story(
        product_id=product_id, 
        generated_text=story_text, 
        tags=ai_result.get("tags", ""),
        audio_url=audio_url
    )
    db.add(new_story)
    db.commit()
    db.refresh(new_story)
    return new_story


# ─── Module 2: Cultural Knowledge Assistant ────────────────────────────────────

@router.post("/ai/chat", summary="[AI] Cultural Knowledge Assistant chatbot")
def cultural_chat(request: ChatRequest):
    result = answer_cultural_query(
        query=request.query,
        conversation_history=request.conversation_history,
        product_context=request.product_context
    )
    return result


# ─── Module 3: Product Description Generator ─────────────────────────────────

@router.post("/ai/generate-description", summary="[AI] Generate SEO product description from raw notes")
def create_description(request: DescriptionRequest, current_user: models.User = Depends(get_current_user)):
    return generate_product_description(
        raw_notes=request.raw_notes,
        material=request.material,
        weave_type=request.weave_type
    )


# ─── Module 4: Storytelling Reels Generator ───────────────────────────────────

@router.post("/ai/generate-reel", summary="[AI] Generate a social media reel storyboard")
def create_reel(request: ReelRequest, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == request.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    artisan_data = {"name": product.artisan.name, "location": product.artisan.location,
                    "years_of_experience": product.artisan.years_of_experience}
    product_data = {"title": product.title, "material": product.material}
    story_text = product.story.generated_text if product.story else ""
    
    return generate_reel_script(artisan_data, product_data, story_text)


# ─── Module 5: Multilingual Translator ────────────────────────────────────────

@router.post("/ai/translate", summary="[AI] Translate text preserving cultural terminology")
def translate(request: TranslateRequest):
    return translate_text(request.text, request.target_language_code, request.source_language_code)

@router.get("/ai/translate/languages", summary="List all supported translation languages")
def list_languages():
    return get_supported_languages()


# ─── Module 6: Emotion Detection Engine ──────────────────────────────────────

@router.post("/ai/detect-emotion", summary="[AI] Detect sentiment and emotion from text")
def emotion_detection(request: EmotionRequest):
    return detect_emotion(request.text)


# ─── Module 7: Heritage Recommendation Engine ────────────────────────────────

@router.post("/ai/recommendations", summary="[AI] Get culturally-linked product recommendations")
def get_recommendations(request: RecommendRequest, db: Session = Depends(get_db)):
    current = db.query(models.Product).filter(models.Product.id == request.product_id).first()
    if not current:
        raise HTTPException(status_code=404, detail="Product not found")
    
    all_products = db.query(models.Product).all()
    current_dict = {
        "id": current.id, "title": current.title, "material": current.material,
        "artisan": {"location": current.artisan.location, "craft": current.artisan.craft}
    }
    all_dicts = [
        {"id": p.id, "title": p.title, "material": p.material,
         "artisan": {"location": p.artisan.location}}
        for p in all_products
    ]
    
    recs = get_heritage_recommendations(current_dict, all_dicts, request.user_history)
    
    enriched = []
    for rec in recs:
        prod = db.query(models.Product).filter(models.Product.id == rec["product_id"]).first()
        if prod:
            enriched.append({
                "product_id": prod.id,
                "title": prod.title,
                "image_url": prod.image_url,
                "price": prod.price,
                "artisan_name": prod.artisan.name,
                "reason": rec["reason"]
            })
    return enriched

