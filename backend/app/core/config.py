from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "WeaveTales AI"
    DATABASE_URL: str = "sqlite:///./weavetales.db"
    SECRET_KEY: str = "weavetales-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
