import { useEffect, useState } from "react"
import type { LessonCatalog, LessonMeta } from "../types"

export function useLessonList(catalog: LessonCatalog) {
  const [lessons, setLessons] = useState<LessonMeta[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        const q = new URLSearchParams({ catalog })
        const r = await fetch(`/api/lessons?${q}`)
        if (!r.ok) throw new Error(String(r.status))
        const data = (await r.json()) as LessonMeta[]
        if (on) setLessons(data.sort((a, b) => a.order - b.order))
      } catch (e) {
        if (on) setError(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      on = false
    }
  }, [catalog])

  return { lessons, error }
}
