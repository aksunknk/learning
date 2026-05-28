import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useAuthorsDemo } from "./hooks/useAuthorsDemo"
import { useLessonDetail } from "./hooks/useLessonDetail"
import { useLessonList } from "./hooks/useLessonList"
import { useLLMStream } from "./hooks/useLLMStream"
import { useProgress } from "./hooks/useProgress"
import { useQuizCheck } from "./hooks/useQuizCheck"
import type { LessonCatalog, LessonMeta, QuizItem } from "./types"

type NavRowProps = {
  idx: number
  lesson: LessonMeta
  active: boolean
  done: boolean
  onSelect: (id: string) => void
}

const NavRow = memo(function NavRow({
  idx,
  lesson,
  active,
  done,
  onSelect,
}: NavRowProps) {
  return (
    <button
      type="button"
      className={active ? "active" : ""}
      onClick={() => onSelect(lesson.id)}
    >
      {done ? <span className="done">●</span> : null}
      <div>
        {String(idx).padStart(2, "0")}. {lesson.title}
      </div>
      <div className="meta">{lesson.summary}</div>
    </button>
  )
})

const QuizItemView = memo(function QuizItemView({
  lessonId,
  item,
  submit,
  disabled,
}: {
  lessonId: string
  item: QuizItem
  submit: ReturnType<typeof useQuizCheck>["submit"]
  disabled: boolean
}) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [sel, setSel] = useState<number | null>(null)

  return (
    <div className="q-block">
      <p>{item.prompt}</p>
      {item.choices.map((c, i) => (
        <label key={i} className="opt">
          <input
            type="radio"
            name={item.id}
            checked={sel === i}
            onChange={() => setSel(i)}
          />
          {c}
        </label>
      ))}
      <div className="row">
        <button
          type="button"
          className="action"
          disabled={disabled || sel === null}
          onClick={async () => {
            if (sel === null) return
            const r = await submit(lessonId, item.id, sel)
            setMsg({
              ok: r.correct,
              text: `${r.correct ? "正解" : "不正解"} — ${r.explanation}`,
            })
          }}
        >
          送信
        </button>
      </div>
      {msg ? (
        <div className={`feed ${msg.ok ? "ok" : "ng"}`}>{msg.text}</div>
      ) : null}
    </div>
  )
})

const CATALOG_STORAGE = "pylearn_catalog_v1"

function readStoredCatalog(): LessonCatalog {
  try {
    const s = localStorage.getItem(CATALOG_STORAGE)
    if (s === "foundation" || s === "engineering") return s
  } catch {
    /* ignore */
  }
  return "engineering"
}

export function App() {
  const [catalog, setCatalog] = useState<LessonCatalog>(() => readStoredCatalog())
  const { lessons, error: listErr } = useLessonList(catalog)
  const { rows: progressRows, mark } = useProgress()
  const [activeId, setActiveId] = useState<string | null>(null)
  const { lesson, error: detailErr } = useLessonDetail(activeId, catalog)
  const { submit, pending } = useQuizCheck()
  const stream = useLLMStream()
  const demo = useAuthorsDemo()
  const [strat, setStrat] = useState<"selectin" | "n_plus_one">("selectin")
  const [prompt, setPrompt] = useState("ローカル推論の待機キュ設計について")

  useEffect(() => {
    try {
      localStorage.setItem(CATALOG_STORAGE, catalog)
    } catch {
      /* ignore */
    }
  }, [catalog])

  useEffect(() => {
    setActiveId(null)
  }, [catalog])

  const doneSet = useMemo(
    () => new Set(progressRows.map((r) => r.lesson_slug)),
    [progressRows],
  )

  useEffect(() => {
    if (lessons?.length && activeId === null) {
      setActiveId(lessons[0].id)
    }
  }, [lessons, activeId])

  const onSelect = useCallback((id: string) => setActiveId(id), [])

  const nav = lessons?.map((L, i) => (
    <NavRow
      key={L.id}
      idx={i + 1}
      lesson={L}
      active={L.id === activeId}
      done={doneSet.has(L.id)}
      onSelect={onSelect}
    />
  ))

  return (
    <div className="layout">
      <nav className="nav">
        <div className="catalog-bar">
          <label className="catalog-label" htmlFor="cat">
            カタログ
          </label>
          <select
            id="cat"
            className="catalog-select"
            value={catalog}
            onChange={(e) =>
              setCatalog(e.target.value as LessonCatalog)
            }
          >
            <option value="engineering">エンジニアリング（改訂後）</option>
            <option value="foundation">基礎トラック（改訂前相当・8章）</option>
          </select>
        </div>
        {nav}
      </nav>
      <div className="main">
        {listErr ? <div className="err">{listErr}</div> : null}
        {!lesson && activeId ? (
          <div className="err">{detailErr ?? "…"}</div>
        ) : null}
        {lesson ? (
          <>
            <h1>{lesson.title}</h1>
            <p className="lede">{lesson.summary}</p>
            {lesson.sections.map((s, si) => (
              <section key={`${lesson.id}-${si}-${s.heading}`}>
                <h2>{s.heading}</h2>
                <p>{s.body}</p>
                {s.code ? <pre className="code">{s.code}</pre> : null}
              </section>
            ))}
            <div className="quiz">
              <h2>Quiz</h2>
              {lesson.quiz.map((q) => (
                <QuizItemView
                  key={q.id}
                  lessonId={lesson.id}
                  item={q}
                  submit={submit}
                  disabled={pending}
                />
              ))}
            </div>
            <div className="row">
              <button
                type="button"
                className="action"
                onClick={() => mark(lesson.id)}
              >
                完了を記録 (SQLite / ORM)
              </button>
            </div>
            {catalog === "engineering" ? (
            <div className="tools">
              <div className="tool">
                <h3>SSE /api/llm/stream</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="row">
                  <button
                    type="button"
                    className="action"
                    disabled={stream.busy}
                    onClick={() => stream.run(prompt)}
                  >
                    ストリーム開始
                  </button>
                  <button
                    type="button"
                    className="action"
                    disabled={!stream.busy}
                    onClick={() => stream.stop()}
                  >
                    中止
                  </button>
                </div>
                {stream.out ? (
                  <pre className="code out">{stream.out}</pre>
                ) : null}
              </div>
              <div className="tool">
                <h3>ORM /api/demo/authors</h3>
                <div className="row">
                  <select
                    value={strat}
                    onChange={(e) =>
                      setStrat(e.target.value as "selectin" | "n_plus_one")
                    }
                  >
                    <option value="selectin">selectin</option>
                    <option value="n_plus_one">n_plus_one</option>
                  </select>
                  <button
                    type="button"
                    className="action"
                    disabled={demo.loading}
                    onClick={() => demo.fetchDemo(strat)}
                  >
                    取得
                  </button>
                </div>
                {demo.error ? <div className="err">{demo.error}</div> : null}
                {demo.data ? (
                  <pre className="code out">
                    {JSON.stringify(demo.data, null, 2)}
                  </pre>
                ) : null}
              </div>
            </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
