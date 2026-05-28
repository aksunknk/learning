import { useCallback, useState } from "react"
import type { AuthorsDemo } from "../types"

export function useAuthorsDemo() {
  const [data, setData] = useState<AuthorsDemo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchDemo = useCallback(async (strategy: "n_plus_one" | "selectin") => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`/api/demo/authors?strategy=${strategy}`)
      if (!r.ok) throw new Error(String(r.status))
      setData((await r.json()) as AuthorsDemo)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, error, loading, fetchDemo }
}
