"""教材 JSON 取得 — クライアントへ正解インデックスは渡さない。"""
from __future__ import annotations

import copy
from typing import Any


def strip_answers(lesson: dict[str, Any]) -> dict[str, Any]:
    payload = copy.deepcopy(lesson)
    for q in payload.get("quiz", []):
        q.pop("correct_index", None)
    return payload
