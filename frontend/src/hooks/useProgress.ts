import { useCallback, useEffect, useState } from "react"
import type { ProgressRow } from "../types"

export function useProgress() {
  const [rows, setRows] = useState<ProgressRow[]>([])
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      const r = await fetch("/api/progress")
      if (!r.ok) throw new Error(String(r.status))
      setRows((await r.json()) as ProgressRow[])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const mark = useCallback(
    async (lessonSlug: string) => {
      const r = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_slug: lessonSlug }),
      })
      if (!r.ok) throw new Error(String(r.status))
      await reload()
    },
    [reload],
  )

  return { rows, mark, reload, error }
}
