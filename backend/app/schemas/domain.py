from pydantic import BaseModel
from typing import Optional, List

class ArtisanBase(BaseModel):
    name: str
    location: str
    craft: str
    bio: str
    years_of_experience: int

class ArtisanCreate(ArtisanBase):
    pass

class Artisan(ArtisanBase):
    id: int

    class Config:
        from_attributes = True

class StoryBase(BaseModel):
    generated_text: str
    tags: str
    audio_url: Optional[str] = None

class StoryCreate(StoryBase):
    pass

class Story(StoryBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    title: str
    material: str
    price: float
    image_url: str
    blockchain_hash: Optional[str] = None
    artisan_id: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    artisan: Artisan
    story: Optional[Story] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: int
    email: str
    is_active: int

    class Config:
        from_attributes = True
