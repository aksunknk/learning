export type LessonCatalog = "engineering" | "foundation"

export type LessonMeta = {
  id: string
  title: string
  summary: string
  order: number
  quiz_count: number
  catalog: LessonCatalog
}

export type LessonSection = {
  heading: string
  body: string
  code: string | null
}

export type QuizItem = {
  id: string
  prompt: string
  choices: string[]
  explanation?: string
}

export type LessonDetail = {
  id: string
  title: string
  summary: string
  order: number
  sections: LessonSection[]
  quiz: QuizItem[]
}

export type QuizResult = {
  correct: boolean
  explanation: string
}

export type AuthorsDemo = {
  strategy: "n_plus_one" | "selectin"
  authors: Array<{
    id: number
    name: string
    articles: Array<{ id: number; title: string }>
  }>
}

export type ProgressRow = {
  lesson_slug: string
  completed_at: string
}
