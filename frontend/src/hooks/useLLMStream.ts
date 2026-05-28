import { useCallback, useRef, useState } from "react"

export function useLLMStream() {
  const [out, setOut] = useState("")
  const [busy, setBusy] = useState(false)
  const ctrl = useRef<AbortController | null>(null)

  const stop = useCallback(() => {
    ctrl.current?.abort()
    ctrl.current = null
  }, [])

  const run = useCallback(
    async (prompt: string) => {
      stop()
      const ac = new AbortController()
      ctrl.current = ac
      setBusy(true)
      setOut("")
      try {
        const res = await fetch("/api/llm/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
          signal: ac.signal,
        })
        if (!res.ok) throw new Error(String(res.status))
        const reader = res.body?.getReader()
        if (!reader) throw new Error("no body")
        const decoder = new TextDecoder()
        let buffer = ""
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split("\n\n")
          buffer = parts.pop() ?? ""
          for (const block of parts) {
            const line = block.startsWith("data: ") ? block.slice(6).trim() : block.trim()
            if (line === "[DONE]") continue
            if (!line) continue
            try {
              const j = JSON.parse(line) as { token: string }
              setOut((s) => s + j.token + " ")
            } catch {
              /* 不完全チャンク */
            }
          }
        }
      } finally {
        setBusy(false)
        ctrl.current = null
      }
    },
    [stop],
  )

  return { out, busy, run, stop }
}
