from app.core.database import engine, Base, SessionLocal
from app.models.domain import User, Artisan, Product
from app.core.auth import get_password_hash
import os

# Drop and recreate all tables
print("Dropping existing tables...")
Base.metadata.drop_all(bind=engine)
print("Creating new tables...")
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    # 1. Create Admin User
    admin_email = "abishekramamoorthy22@gmail.com"
    print(f"Creating admin user: {admin_email}")
    hashed_pwd = get_password_hash("password123") # Default password
    admin_user = User(email=admin_email, hashed_password=hashed_pwd, is_active=1)
    db.add(admin_user)
    
    # 2. Seed Initial Artisans
    artisan1 = Artisan(
        name="Lakshmi Narayan",
        location="Kanchipuram, Tamil Nadu",
        craft="Kanjivaram Silk Weaving",
        bio="A 4th-generation master weaver specializing in pure mulberry silk and gold zari motifs. My family has been weaving for the royal temples for over a century.",
        years_of_experience=35
    )
    artisan2 = Artisan(
        name="Abdul Rahim",
        location="Varanasi, Uttar Pradesh",
        craft="Banarasi Brocade",
        bio="Preserving the Mughal-era art of Kadwa brocade weaving. Every thread is interlaced by hand without floating threads on the reverse.",
        years_of_experience=28
    )
    db.add(artisan1)
    db.add(artisan2)
    db.commit()

    # 3. Seed Initial Products
    prod1 = Product(
        title="Royal Crimson Kanjivaram Bridal Silk",
        material="100% Pure Mulberry Silk & 3G Gold Zari",
        price=450.00,
        image_url="https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        blockchain_hash="0xabc123def4567890abcdef1234567890abcdef1234567890abcdef1234567890",
        artisan_id=artisan1.id
    )
    prod2 = Product(
        title="Midnight Blue Kadwa Banarasi",
        material="Katan Silk & Silver Zari",
        price=320.00,
        image_url="https://images.unsplash.com/photo-1583391733958-611591054b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        blockchain_hash="0xdef4567890abcdef1234567890abcdef1234567890abcdef1234567890abc123",
        artisan_id=artisan2.id
    )
    db.add(prod1)
    db.add(prod2)
    db.commit()

    print("Database rebuilt and seeded successfully!")
finally:
    db.close()
