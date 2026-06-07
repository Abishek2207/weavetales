import hashlib
import uuid
import qrcode
import io
import base64
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.database import get_db
from app.models.models import Product, Story, DigitalPassport, ImpactMetric, User
from app.core.security import get_current_user
from app.api.schemas import ProductCreate, ProductOut, ImpactMetricCreate, ImpactMetricOut, PassportOut

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = Product(artisan_id=current_user.id, **product_data.model_dump())
    db.add(product)
    await db.flush()

    # Auto-create a digital passport with a unique hash
    auth_hash = hashlib.sha256(f"{product.id}{uuid.uuid4()}".encode()).hexdigest()[:16].upper()

    # Generate QR code as base64
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(f"https://weavetales.app/passport/{auth_hash}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode()

    passport = DigitalPassport(
        product_id=product.id,
        authenticity_hash=auth_hash,
        qr_code_url=f"data:image/png;base64,{qr_base64}",
    )
    db.add(passport)

    # Auto-create impact metric
    impact = ImpactMetric(product_id=product.id)
    db.add(impact)

    await db.commit()
    await db.refresh(product)
    return product


@router.get("/", response_model=list[ProductOut])
async def list_products(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/my", response_model=list[ProductOut])
async def my_products(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Product).where(Product.artisan_id == current_user.id))
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/{product_id}/impact", response_model=ImpactMetricOut)
async def set_impact(
    product_id: str,
    impact_data: ImpactMetricCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(ImpactMetric).where(ImpactMetric.product_id == product_id))
    impact = result.scalar_one_or_none()
    if not impact:
        impact = ImpactMetric(product_id=product_id, **impact_data.model_dump())
        db.add(impact)
    else:
        for key, val in impact_data.model_dump().items():
            setattr(impact, key, val)
    await db.commit()
    await db.refresh(impact)
    return impact
