import os
import sys

# Add the backend directory to python path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.models import domain as models

def seed_db():
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already have data
    if db.query(models.Artisan).first():
        print("Database already seeded!")
        return

    print("Seeding Artisans...")
    artisan1 = models.Artisan(
        name="Lakshmi Devi",
        location="Kanchipuram, Tamil Nadu",
        craft="Kanjeevaram Silk Weaving",
        bio="Lakshmi learned the art of weaving Kanjeevaram silk from her mother. She has been weaving for over 30 years and specializes in pure zari work.",
        years_of_experience=32
    )
    
    artisan2 = models.Artisan(
        name="Rahul Vankar",
        location="Bhujodi, Gujarat",
        craft="Kala Cotton Weaving",
        bio="A young artisan bringing traditional geometric motifs to modern, sustainable Kala cotton.",
        years_of_experience=8
    )
    
    db.add(artisan1)
    db.add(artisan2)
    db.commit()
    
    print("Seeding Products...")
    product1 = models.Product(
        title="Royal Crimson Kanjeevaram",
        material="Pure Mulberry Silk and Gold Zari",
        price=450.00,
        image_url="https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&q=80&w=800",
        artisan_id=artisan1.id
    )
    
    product2 = models.Product(
        title="Desert Night Shawl",
        material="Organic Kala Cotton",
        price=120.00,
        image_url="https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?auto=format&fit=crop&q=80&w=800",
        artisan_id=artisan2.id
    )
    
    db.add(product1)
    db.add(product2)
    db.commit()
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
