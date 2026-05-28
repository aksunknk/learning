import { useCallback, useState } from "react"
import type { QuizResult } from "../types"

export function useQuizCheck() {
  const [pending, setPending] = useState(false)

  const submit = useCallback(
    async (lessonId: string, questionId: string, choiceIndex: number) => {
      setPending(true)
      try {
        const r = await fetch("/api/quiz/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lesson_id: lessonId,
            question_id: questionId,
            choice_index: choiceIndex,
          }),
        })
        if (!r.ok) throw new Error(String(r.status))
        return (await r.json()) as QuizResult
      } finally {
        setPending(false)
      }
    },
    [],
  )

  return { submit, pending }
}
