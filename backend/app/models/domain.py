from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Artisan(Base):
    __tablename__ = "artisans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    craft = Column(String)
    bio = Column(Text)
    years_of_experience = Column(Integer)
    
    products = relationship("Product", back_populates="artisan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    material = Column(String)
    price = Column(Float)
    image_url = Column(String)
    blockchain_hash = Column(String, nullable=True) # Digital Authenticity Certificate
    artisan_id = Column(Integer, ForeignKey("artisans.id"))
    
    artisan = relationship("Artisan", back_populates="products")
    story = relationship("Story", back_populates="product", uselist=False)

class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True)
    generated_text = Column(Text)
    tags = Column(String) # Stored as comma-separated string for simplicity
    audio_url = Column(String, nullable=True) # URL to generated TTS audio
    
    product = relationship("Product", back_populates="story")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Integer, default=1)
