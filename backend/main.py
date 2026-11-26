from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    frontend_origins: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
app = FastAPI(title="Tajik Sado AI API", version="0.1.0", description="Phase 1 world service")
origins = [origin.strip() for origin in settings.frontend_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

LOCATIONS = [
    {"id": "school", "name": {"en": "Sado Academy", "ru": "Академия Садо", "tg": "Академияи Садо"}, "kind": "education"},
    {"id": "market", "name": {"en": "Old town market", "ru": "Старый рынок", "tg": "Бозори кӯҳна"}, "kind": "market"},
    {"id": "home-west", "name": {"en": "Courtyard homes", "ru": "Дворовые дома", "tg": "Ҳавлиҳои истиқоматӣ"}, "kind": "home"},
    {"id": "home-east", "name": {"en": "Mountain homes", "ru": "Дома у гор", "tg": "Хонаҳои кӯҳӣ"}, "kind": "home"},
    {"id": "park", "name": {"en": "Rudaki Park", "ru": "Парк Рудаки", "tg": "Боғи Рӯдакӣ"}, "kind": "park"},
]


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "tajik-sado-ai-api", "phase": "1"}


@app.get("/api/locations")
def get_locations() -> dict[str, list[dict[str, object]]]:
    return {"locations": LOCATIONS}
