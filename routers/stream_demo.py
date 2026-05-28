from __future__ import annotations

import asyncio
import json
import re
from typing import Literal

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from db import get_session
from models import Article, Author
from schemas import ArticleBrief, AuthorBrief, AuthorsDemoOut, StreamPromptIn

router = APIRouter(tags=["llm", "demo"])

_TOKEN_SPLIT = re.compile(r"\s+|(?<=[>}{])|(?=[>}{])|(?<=[.,;:])|(?=[.,;:])", re.UNICODE)


def _mock_tokens(prompt: str, cap: int = 96) -> list[str]:
    parts: list[str] = []
    for m in _TOKEN_SPLIT.split(prompt.strip()):
        if m:
            parts.append(m)
        if len(parts) >= cap:
            break
    if not parts:
        return ["…"]
    return parts


@router.post("/llm/stream")
async def llm_stream(body: StreamPromptIn):
    """ローカル LLM のスタブ。llama.cpp / transformers のトークン生成器へ差し替え可能。"""

    async def event_iter():
        for tok in _mock_tokens(body.prompt):
            chunk = json.dumps({"token": tok}, ensure_ascii=False)
            yield f"data: {chunk}\n\n"
            await asyncio.sleep(0.012)
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_iter(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/demo/authors", response_model=AuthorsDemoOut)
def authors_demo(
    strategy: Literal["n_plus_one", "selectin"] = "selectin",
    session: Session = Depends(get_session),
) -> AuthorsDemoOut:
    if strategy == "n_plus_one":
        authors = session.scalars(select(Author)).all()
        out: list[AuthorBrief] = []
        for a in authors:
            arts = session.scalars(
                select(Article).where(Article.author_id == a.id)
            ).all()
            out.append(
                AuthorBrief(
                    id=a.id,
                    name=a.name,
                    articles=[ArticleBrief(id=x.id, title=x.title) for x in arts],
                )
            )
        return AuthorsDemoOut(strategy=strategy, authors=out)

    stmt = select(Author).options(selectinload(Author.articles))
    authors = session.scalars(stmt).unique().all()
    payload = [
        AuthorBrief(
            id=a.id,
            name=a.name,
            articles=[ArticleBrief(id=x.id, title=x.title) for x in a.articles],
        )
        for a in authors
    ]
    return AuthorsDemoOut(strategy=strategy, authors=payload)
