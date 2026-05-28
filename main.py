"""アプリ合成。API は /api 配下、SPA は /static/spa ビルド成果物。"""
from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

import catalog
from db import SessionLocal, init_db
from models import seed_demo
from routers import lessons, progress, stream_demo
from schemas import HealthOut

ROOT = Path(__file__).resolve().parent
SPA_DIST = ROOT / "static" / "spa"


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_demo(db)
    finally:
        db.close()
    catalog.load_lessons()
    SPA_DIST.mkdir(parents=True, exist_ok=True)
    (SPA_DIST / "assets").mkdir(exist_ok=True)
    yield


app = FastAPI(title="PyLearn", lifespan=lifespan, docs_url="/api/docs", redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lessons.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(stream_demo.router, prefix="/api")


@app.get("/api/health", response_model=HealthOut)
def health() -> HealthOut:
    return HealthOut()


@app.get("/")
def spa_index() -> FileResponse:
    index = SPA_DIST / "index.html"
    return FileResponse(index)


app.mount(
    "/assets",
    StaticFiles(directory=SPA_DIST / "assets"),
    name="assets",
)
