from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.models import UserRole


# Auth schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: UserRole = UserRole.artisan
    location: Optional[str] = None
    bio: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    location: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Product schemas
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    material: Optional[str] = None
    technique: Optional[str] = None
    region_of_origin: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None


class ProductOut(BaseModel):
    id: str
    artisan_id: str
    name: str
    description: Optional[str]
    material: Optional[str]
    technique: Optional[str]
    region_of_origin: Optional[str]
    price: Optional[float]
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Story schemas
class StoryOut(BaseModel):
    id: str
    product_id: str
    generated_story: Optional[str]
    cultural_heritage_context: Optional[str]
    artisan_journey: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Passport schemas
class PassportOut(BaseModel):
    id: str
    product_id: str
    qr_code_url: Optional[str]
    authenticity_hash: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Impact schemas
class ImpactMetricCreate(BaseModel):
    carbon_footprint_saved: float = 0.0
    fair_wage_percentage: float = 0.0
    artisan_hours: float = 0.0
    water_saved_liters: float = 0.0


class ImpactMetricOut(ImpactMetricCreate):
    id: str
    product_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Sponsorship schemas
class SponsorshipCreate(BaseModel):
    artisan_id: str
    amount: float
    message: Optional[str] = None


class SponsorshipOut(BaseModel):
    id: str
    sponsor_id: str
    artisan_id: str
    amount: float
    message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Chatbot schemas
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str


# Analytics schemas
class DashboardStats(BaseModel):
    total_products: int
    total_artisans: int
    total_stories: int
    total_passports: int
    total_sponsorships: float
    total_carbon_saved: float
