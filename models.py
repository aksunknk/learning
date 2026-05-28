"""SQLAlchemy 2.0 宣言型モデル。"""
from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Author(Base):
    __tablename__ = "author"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    articles: Mapped[list["Article"]] = relationship(back_populates="author")


class Article(Base):
    __tablename__ = "article"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(512))
    author_id: Mapped[int] = mapped_column(ForeignKey("author.id"), index=True)
    author: Mapped[Author] = relationship(back_populates="articles")


class LessonCompletion(Base):
    __tablename__ = "lessoncompletion"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    lesson_slug: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )


def seed_demo(session: Session) -> None:
    from sqlalchemy import select

    if session.scalars(select(Author)).first():
        return
    a1 = Author(name="Inference")
    a2 = Author(name="Frontend")
    a3 = Author(name="Storage")
    session.add_all([a1, a2, a3])
    session.commit()
    session.refresh(a1)
    session.refresh(a2)
    session.refresh(a3)
    session.add_all(
        [
            Article(title="GGUF と mmap", author_id=a1.id),
            Article(title="CUDA graph の取舍", author_id=a1.id),
            Article(title="AbortController と SSE", author_id=a2.id),
            Article(title="参照透過性とメモ化", author_id=a2.id),
            Article(title="selectinload の粒度", author_id=a3.id),
        ]
    )
    session.commit()
