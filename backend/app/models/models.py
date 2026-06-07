from sqlalchemy import Column, String, Float, DateTime, Text, Enum, ForeignKey, Boolean
from sqlalchemy.dialects.sqlite import TEXT
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from .database import Base


def gen_uuid():
    return str(uuid.uuid4())


class UserRole(str, enum.Enum):
    admin = "admin"
    artisan = "artisan"
    sponsor = "sponsor"
    consumer = "consumer"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.artisan, nullable=False)
    location = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("Product", back_populates="artisan", foreign_keys="Product.artisan_id")
    sponsorships_given = relationship("Sponsorship", back_populates="sponsor", foreign_keys="Sponsorship.sponsor_id")
    sponsorships_received = relationship("Sponsorship", back_populates="artisan", foreign_keys="Sponsorship.artisan_id")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=gen_uuid)
    artisan_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    material = Column(String, nullable=True)
    technique = Column(String, nullable=True)
    region_of_origin = Column(String, nullable=True)
    price = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    artisan = relationship("User", back_populates="products", foreign_keys=[artisan_id])
    story = relationship("Story", back_populates="product", uselist=False)
    passport = relationship("DigitalPassport", back_populates="product", uselist=False)
    impact = relationship("ImpactMetric", back_populates="product", uselist=False)


class Story(Base):
    __tablename__ = "stories"

    id = Column(String, primary_key=True, default=gen_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, unique=True)
    generated_story = Column(Text, nullable=True)
    cultural_heritage_context = Column(Text, nullable=True)
    artisan_journey = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="story")


class DigitalPassport(Base):
    __tablename__ = "digital_passports"

    id = Column(String, primary_key=True, default=gen_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, unique=True)
    qr_code_url = Column(String, nullable=True)
    authenticity_hash = Column(String, unique=True, nullable=False)
    status = Column(String, default="authentic")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="passport")


class ImpactMetric(Base):
    __tablename__ = "impact_metrics"

    id = Column(String, primary_key=True, default=gen_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, unique=True)
    carbon_footprint_saved = Column(Float, default=0.0)
    fair_wage_percentage = Column(Float, default=0.0)
    artisan_hours = Column(Float, default=0.0)
    water_saved_liters = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="impact")


class Sponsorship(Base):
    __tablename__ = "sponsorships"

    id = Column(String, primary_key=True, default=gen_uuid)
    sponsor_id = Column(String, ForeignKey("users.id"), nullable=False)
    artisan_id = Column(String, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sponsor = relationship("User", back_populates="sponsorships_given", foreign_keys=[sponsor_id])
    artisan = relationship("User", back_populates="sponsorships_received", foreign_keys=[artisan_id])


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
