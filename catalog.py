from __future__ import annotations

import json
from pathlib import Path
from typing import Literal

ROOT = Path(__file__).resolve().parent
PATH_FOUNDATION = ROOT / "data" / "lessons_foundation.json"
PATH_ENGINEERING = ROOT / "data" / "lessons_engineering.json"
PATH_BYOX = ROOT / "data" / "lessons_byox.json"

LessonCatalog = Literal["engineering", "foundation", "byox"]

_foundation: list[dict] = []
_engineering: list[dict] = []
_byox: list[dict] = []


def load_lessons() -> None:
    global _foundation, _engineering, _byox
    with PATH_FOUNDATION.open(encoding="utf-8") as f:
        _foundation = json.load(f)
    with PATH_ENGINEERING.open(encoding="utf-8") as f:
        _engineering = json.load(f)
    with PATH_BYOX.open(encoding="utf-8") as f:
        _byox = json.load(f)


def lessons_for_catalog(catalog: LessonCatalog) -> list[dict]:
    if catalog == "engineering":
        return _engineering
    if catalog == "byox":
        return _byox
    return _foundation


def find_lesson_any(lesson_id: str) -> dict | None:
    for pool in (_engineering, _foundation, _byox):
        for item in pool:
            if item["id"] == lesson_id:
                return item
    return None
