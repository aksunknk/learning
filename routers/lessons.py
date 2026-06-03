from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Query

from catalog import LessonCatalog, find_lesson_any, lessons_for_catalog
from lesson_sanitize import strip_answers
from schemas import LessonMetaOut, QuizAnswerIn, QuizAnswerOut

router = APIRouter(tags=["lessons"])

_CATALOG_QUERY = Annotated[
    LessonCatalog,
    Query(description="engineering: 改訂後（AI/FS）, foundation: 改訂前の基礎教材"),
]


@router.get("/catalogs")
def list_catalogs() -> list[dict]:
    return [
        {
            "id": "engineering",
            "label": "エンジニアリング",
            "note": "FastAPI / SSE / React / ORM・N+1 ほか（改訂後）",
        },
        {
            "id": "foundation",
            "label": "基礎トラック",
            "note": "Python 言語基礎（改訂前の原本相当）",
        },
        {
            "id": "byox",
            "label": "Build Your Own X",
            "note": "BYOX 引用コードの詳細解説（Web/Redis/Lispy/JSON/Git）",
        },
    ]


@router.get("/lessons", response_model=list[LessonMetaOut])
def list_lessons(catalog: _CATALOG_QUERY = "engineering") -> list[LessonMetaOut]:
    rows = sorted(lessons_for_catalog(catalog), key=lambda x: x["order"])
    return [
        LessonMetaOut(
            id=item["id"],
            title=item["title"],
            summary=item.get("summary", ""),
            order=item["order"],
            quiz_count=len(item.get("quiz", [])),
            catalog=catalog,
        )
        for item in rows
    ]


@router.get("/lessons/{lesson_id}")
def get_lesson(
    lesson_id: str,
    catalog: Literal["engineering", "foundation", "byox"] | None = Query(
        default=None,
        description="省略時は両カタログから id で検索（id はカタログ間で重複しない）",
    ),
) -> dict:
    if catalog is not None:
        for item in lessons_for_catalog(catalog):
            if item["id"] == lesson_id:
                return strip_answers(item)
        raise HTTPException(status_code=404, detail="lesson not found")
    found = find_lesson_any(lesson_id)
    if not found:
        raise HTTPException(status_code=404, detail="lesson not found")
    return strip_answers(found)


@router.post("/quiz/check", response_model=QuizAnswerOut)
def check_quiz(body: QuizAnswerIn) -> QuizAnswerOut:
    item = find_lesson_any(body.lesson_id)
    if not item:
        raise HTTPException(status_code=404, detail="lesson not found")
    for q in item.get("quiz", []):
        if q["id"] == body.question_id:
            ok = q["correct_index"] == body.choice_index
            return QuizAnswerOut(correct=ok, explanation=q.get("explanation", ""))
    raise HTTPException(status_code=404, detail="question not found")
