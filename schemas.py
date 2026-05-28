"""入出力境界の厳密な Pydantic モデル（ORM とは分離）。"""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class QuizAnswerIn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    lesson_id: str = Field(..., min_length=1)
    question_id: str = Field(..., min_length=1)
    choice_index: int = Field(..., ge=0)


class QuizAnswerOut(BaseModel):
    model_config = ConfigDict(extra="forbid")

    correct: bool
    explanation: str


class HealthOut(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: Literal["ok"] = "ok"


class LessonMetaOut(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    summary: str
    order: int
    quiz_count: int
    catalog: Literal["engineering", "foundation"] = "engineering"


class StreamPromptIn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    prompt: str = Field(..., min_length=1, max_length=16_384)


class ArticleBrief(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: int
    title: str


class AuthorBrief(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: int
    name: str
    articles: list[ArticleBrief]


class AuthorsDemoOut(BaseModel):
    model_config = ConfigDict(extra="forbid")

    strategy: Literal["n_plus_one", "selectin"]
    authors: list[AuthorBrief]


class ProgressUpsertIn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    lesson_slug: str = Field(..., min_length=1)


class ProgressOut(BaseModel):
    model_config = ConfigDict(extra="forbid")

    lesson_slug: str
    completed_at: datetime
