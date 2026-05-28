import { useEffect, useState } from "react"
import type { LessonCatalog, LessonDetail } from "../types"

export function useLessonDetail(lessonId: string | null, catalog: LessonCatalog) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lessonId) {
      setLesson(null)
      return
    }
    const ac = new AbortController()
    setError(null)
    const q = new URLSearchParams({ catalog })
    ;(async () => {
      try {
        const r = await fetch(`/api/lessons/${lessonId}?${q}`, {
          signal: ac.signal,
        })
        if (!r.ok) throw new Error(String(r.status))
        const data = (await r.json()) as LessonDetail
        if (!ac.signal.aborted) setLesson(data)
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
        if (!ac.signal.aborted) {
          setError(e instanceof Error ? e.message : String(e))
        }
      }
    })()
    return () => ac.abort()
  }, [lessonId, catalog])

  return { lesson, error }
}
