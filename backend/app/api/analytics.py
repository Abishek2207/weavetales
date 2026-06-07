from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.database import get_db
from app.models.models import User, Product, Story, DigitalPassport, Sponsorship, ImpactMetric
from app.core.security import get_current_user
from app.api.schemas import SponsorshipCreate, SponsorshipOut, DashboardStats

router = APIRouter(prefix="/api", tags=["Analytics & Sponsorships"])


@router.get("/analytics/dashboard", response_model=DashboardStats)
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    total_products = (await db.execute(func.count(Product.id))).scalar() or 0
    total_artisans = (await db.execute(func.count(User.id).filter(User.role == "artisan"))).scalar() or 0
    total_stories = (await db.execute(func.count(Story.id))).scalar() or 0
    total_passports = (await db.execute(func.count(DigitalPassport.id))).scalar() or 0
    total_sponsorships = (await db.execute(func.sum(Sponsorship.amount))).scalar() or 0.0
    total_carbon = (await db.execute(func.sum(ImpactMetric.carbon_footprint_saved))).scalar() or 0.0

    return DashboardStats(
        total_products=total_products,
        total_artisans=total_artisans,
        total_stories=total_stories,
        total_passports=total_passports,
        total_sponsorships=float(total_sponsorships),
        total_carbon_saved=float(total_carbon),
    )


@router.get("/artisans", response_model=list)
async def list_artisans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.role == "artisan"))
    artisans = result.scalars().all()
    return [
        {"id": a.id, "name": a.name, "location": a.location, "bio": a.bio, "avatar_url": a.avatar_url}
        for a in artisans
    ]


@router.post("/sponsors/fund", response_model=SponsorshipOut, status_code=status.HTTP_201_CREATED)
async def fund_artisan(
    data: SponsorshipCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    artisan_result = await db.execute(select(User).where(User.id == data.artisan_id))
    artisan = artisan_result.scalar_one_or_none()
    if not artisan:
        raise HTTPException(status_code=404, detail="Artisan not found")

    sponsorship = Sponsorship(
        sponsor_id=current_user.id,
        artisan_id=data.artisan_id,
        amount=data.amount,
        message=data.message,
    )
    db.add(sponsorship)
    await db.commit()
    await db.refresh(sponsorship)
    return sponsorship


@router.get("/sponsors/my", response_model=list[SponsorshipOut])
async def my_sponsorships(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Sponsorship).where(Sponsorship.sponsor_id == current_user.id))
    return result.scalars().all()
