from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.database import get_db
from app.models.models import DigitalPassport, Product, Story, ImpactMetric, User
from app.api.schemas import PassportOut

router = APIRouter(prefix="/api/passport", tags=["Digital Passport"])


@router.get("/{auth_hash}")
async def get_passport_public(auth_hash: str, db: AsyncSession = Depends(get_db)):
    """Public endpoint: anyone with QR code can view the product passport."""
    result = await db.execute(select(DigitalPassport).where(DigitalPassport.authenticity_hash == auth_hash))
    passport = result.scalar_one_or_none()
    if not passport:
        raise HTTPException(status_code=404, detail="Passport not found")

    product_result = await db.execute(select(Product).where(Product.id == passport.product_id))
    product = product_result.scalar_one_or_none()

    story_result = await db.execute(select(Story).where(Story.product_id == passport.product_id))
    story = story_result.scalar_one_or_none()

    impact_result = await db.execute(select(ImpactMetric).where(ImpactMetric.product_id == passport.product_id))
    impact = impact_result.scalar_one_or_none()

    artisan_result = await db.execute(select(User).where(User.id == product.artisan_id)) if product else None
    artisan = artisan_result.scalar_one_or_none() if artisan_result else None

    return {
        "passport": {
            "authenticity_hash": passport.authenticity_hash,
            "status": passport.status,
            "qr_code_url": passport.qr_code_url,
            "created_at": passport.created_at,
        },
        "product": {
            "id": product.id if product else None,
            "name": product.name if product else None,
            "material": product.material if product else None,
            "technique": product.technique if product else None,
            "region_of_origin": product.region_of_origin if product else None,
            "price": product.price if product else None,
            "image_url": product.image_url if product else None,
        } if product else None,
        "story": {
            "generated_story": story.generated_story if story else None,
            "cultural_heritage_context": story.cultural_heritage_context if story else None,
            "artisan_journey": story.artisan_journey if story else None,
        } if story else None,
        "artisan": {
            "name": artisan.name if artisan else None,
            "location": artisan.location if artisan else None,
            "bio": artisan.bio if artisan else None,
        } if artisan else None,
        "impact": {
            "carbon_footprint_saved": impact.carbon_footprint_saved if impact else 0,
            "fair_wage_percentage": impact.fair_wage_percentage if impact else 0,
            "artisan_hours": impact.artisan_hours if impact else 0,
            "water_saved_liters": impact.water_saved_liters if impact else 0,
        } if impact else None,
    }
