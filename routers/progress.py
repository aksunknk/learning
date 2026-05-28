from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from db import get_session
from models import LessonCompletion
from schemas import ProgressOut, ProgressUpsertIn

router = APIRouter(tags=["progress"])


@router.get("/progress", response_model=list[ProgressOut])
def list_progress(session: Session = Depends(get_session)) -> list[ProgressOut]:
    rows = session.scalars(select(LessonCompletion)).all()
    return [
        ProgressOut(lesson_slug=r.lesson_slug, completed_at=r.completed_at)
        for r in rows
    ]


@router.post("/progress", response_model=ProgressOut)
def upsert_progress(
    body: ProgressUpsertIn, session: Session = Depends(get_session)
) -> ProgressOut:
    cur = session.scalars(
        select(LessonCompletion).where(LessonCompletion.lesson_slug == body.lesson_slug)
    ).first()
    if cur:
        cur.completed_at = datetime.now(timezone.utc)
    else:
        session.add(LessonCompletion(lesson_slug=body.lesson_slug))
    session.commit()
    row = session.scalars(
        select(LessonCompletion).where(LessonCompletion.lesson_slug == body.lesson_slug)
    ).one()
    return ProgressOut(lesson_slug=row.lesson_slug, completed_at=row.completed_at)
