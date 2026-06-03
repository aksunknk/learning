import { useState } from "react"
import type { useQuizCheck } from "../hooks/useQuizCheck"

type Props = {
  onComplete: () => void
  submit: ReturnType<typeof useQuizCheck>["submit"]
  pending: boolean
}

const AUTH_CODE = `# app/api/dependencies/authentication.py（抜粋）
# 出典: nsidnev/fastapi-realworld-example-app

def get_current_user_authorizer(*, required: bool = True) -> Callable:
    return _get_current_user if required else _get_current_user_optional

async def _get_current_user(
    users_repo: UsersRepository = Depends(get_repository(UsersRepository)),
    token: str = Depends(_get_authorization_header_retriever()),
    settings: AppSettings = Depends(get_app_settings),
) -> User:
    try:
        username = jwt.get_username_from_token(
            token,
            str(settings.secret_key.get_secret_value()),
        )
    except ValueError:
        raise HTTPException(status_code=403, detail=strings.MALFORMED_PAYLOAD)
    try:
        return await users_repo.get_user_by_username(username=username)
    except EntityDoesNotExist:
        raise HTTPException(status_code=403, detail=strings.MALFORMED_PAYLOAD)`

const DB_CODE = `# app/api/dependencies/database.py（抜粋）

def get_repository(repo_type: Type[BaseRepository]) -> Callable:
    def _get_repo(
        conn: Connection = Depends(_get_connection_from_pool),
    ) -> BaseRepository:
        return repo_type(conn)
    return _get_repo

async def _get_connection_from_pool(
    pool: Pool = Depends(_get_db_pool),
) -> AsyncGenerator[Connection, None]:
    async with pool.acquire() as conn:
        yield conn`

const ARTICLE_CODE = `# app/api/dependencies/articles.py（抜粋）

async def get_article_by_slug_from_path(
    slug: str = Path(..., min_length=1),
    user: Optional[User] = Depends(get_current_user_authorizer(required=False)),
    articles_repo: ArticlesRepository = Depends(get_repository(ArticlesRepository)),
) -> Article:
    return await articles_repo.get_article_by_slug(slug=slug, requested_user=user)`

const GRAMMAR = [
  {
    tag: "Depends(callable)",
    rule: "関数引数のデフォルト値位置に Depends(別関数) を書くと、FastAPI がリクエストごとにその関数を実行し、戻り値を引数へ注入する。",
    why: "ルート本体から DB 取得・認証・設定読み込みを消し、引数として User や Repository が届く状態を作るため。",
    ex: "token: str = Depends(_get_authorization_header_retriever())",
  },
  {
    tag: "戻り値型ヒント -> T",
    rule: "関数が何を返すかを宣言する。FastAPI は -> User のように返り値から OpenAPI やレスポンス検証の手がかりを得る。",
    why: "依存関数・ルート関数とも「注入結果の型」を明示し、エディタ補完とレビュー可能性を上げるため。",
    ex: "async def _get_current_user(...) -> User:",
  },
  {
    tag: "async def / await",
    rule: "非同期関数は await で I/O 待ちを他タスクに譲る。DB・HTTP 呼び出しは async ルート＋async 依存が組み合わされる。",
    why: "RealWorld 実装は asyncpg で DB I/O を非同期化しており、スレッド枯渇を避けるため。",
    ex: "return await users_repo.get_user_by_username(username=username)",
  },
  {
    tag: "yield（ジェネレータ依存）",
    rule: "依存関数内で yield すると、リクエスト処理後に finally 相当の後処理が走る。DB 接続の返却に使う。",
    why: "接続をルート全体のスコープで保持し、終了時にプールへ返すため（取得→利用→返却の命周期管理）。",
    ex: "async with pool.acquire() as conn:\\n    yield conn",
  },
  {
    tag: "Callable / Optional / Type",
    rule: "Callable は「呼び出し可能オブジェクト」、Optional[T] は T|None、Type[Cls] はクラスオブジェクトそのものを指す型。",
    why: "get_repository(repo_type: Type[BaseRepository]) のように、型を値として渡す DI ファクトリを表現するため。",
    ex: "def get_repository(repo_type: Type[BaseRepository]) -> Callable[..., BaseRepository]:",
  },
  {
    tag: "キーワード専用引数 *",
    rule: "def f(*, required: bool = True) は required をキーワードでしか渡せない。位置引数ミスを防ぐ。",
    why: "get_current_user_authorizer(required=False) の意図を呼び出し側で明確化するため。",
    ex: "get_current_user_authorizer(required=False)",
  },
  {
    tag: "Security()",
    rule: "Security は Depends の拡張で、OpenAPI 上で Authorization ヘッダ等のセキュリティスキームを明示できる。",
    why: "JWT トークンをヘッダから取り出す依存を API ドキュメントと一体で表現するため。",
    ex: "api_key: str = Security(RWAPIKeyHeader(name=HEADER_KEY))",
  },
]

const QUIZ = [
  {
    id: "fastapi-di-realworld_q1",
    prompt:
      "get_repository(UsersRepository) を Depends に渡す設計の主な利点はどれか。",
    choices: [
      "ルートが Repository 実装を直接 new しなくてよい",
      "JWT の有効期限が自動延長される",
      "SQL が不要になる",
    ],
    correct: 0,
    explanation:
      "依存として注入することで、ルートは永続化の詳細から切り離される。",
  },
  {
    id: "fastapi-di-realworld_q2",
    prompt: "_get_connection_from_pool で yield を使う主理由はどれか。",
    choices: [
      "リクエスト終了後に接続をプールへ返却するため",
      "JSON をパースするため",
      "CORS ヘッダを付与するため",
    ],
    correct: 0,
    explanation:
      "ジェネレータ依存は前処理・後処理の両方を持てる。接続のクリーンアップに使う。",
  },
  {
    id: "fastapi-di-realworld_q3",
    prompt:
      "get_current_user_authorizer(required=False) が返す依存チェーンの意味として正しいのはどれか。",
    choices: [
      "認証必須ではなく、トークンがあれば User を、なければ None を返しうる",
      "常に 401 を返す",
      "DB マイグレーションを実行する",
    ],
    correct: 0,
    explanation:
      "required=False によりオプショナル認証パスへ切り替えるファクトリパターン。",
  },
]

export function FastApiDiChapter({ onComplete, submit, pending }: Props) {
  const [quizMsg, setQuizMsg] = useState<Record<string, string>>({})

  return (
    <article className="di-chapter">
      <p className="source">
        引用元:{" "}
        <span className="accent">
          github.com/nsidnev/fastapi-realworld-example-app
        </span>{" "}
        — app/api/dependencies/（authentication.py, database.py, articles.py）
      </p>
      <h1>
        <span className="accent">[DI]</span> FastAPI RealWorld — 依存性注入の解剖
      </h1>
      <p className="lede">
        実運用コードをトップダウン（設計意図）とボトムアップ（Python
        文法）の二層で読み解く。
      </p>

      <section className="di-layer di-layer-top">
        <h2>
          <span className="accent">01</span> トップダウン — プロはなぜこう書くか
        </h2>
        <p>
          RealWorld 構成では{" "}
          <code className="accent">app/api/dependencies/</code>{" "}
          が横断関心事のハブです。routes は HTTP
          入出力に集中し、DB・認証・認可・フィルタ生成は依存として積み上げます。ルート関数の引数リストが「このエンドポイントが何を必要とするか」の宣言になるため、レビュー時に追跡が容易です。
        </p>

        <h3>レイヤ分離の意図</h3>
        <p>
          <span className="accent">database.py</span> は接続プールと
          Repository ファクトリ、
          <span className="accent"> authentication.py</span> は JWT と
          Current User、
          <span className="accent">articles.py</span>{" "}
          は記事スラッグ解決と著者権限チェックを担当します。責務がファイル単位で割れているため、変更の影響範囲が読めます。
        </p>
        <pre className="code">{DB_CODE}</pre>
        <p>
          <span className="accent">get_repository</span>{" "}
          は「型（UsersRepository）を受け取り、Depends
          可能な関数を返す」高階関数です。ルート側は{" "}
          <code>Depends(get_repository(UsersRepository))</code>{" "}
          一行で済み、テスト時は依存をオーバーライドしてモック
          Repository を差し込めます。
        </p>

        <h3>認証チェーンの意図</h3>
        <pre className="code">{AUTH_CODE}</pre>
        <p>
          トークン文字列の抽出（Header）→ 設定の注入（AppSettings）→
          Repository 経由の User 取得、という直列パイプラインが Depends
          で宣言されています。ルートは{" "}
          <code>user: User = Depends(get_current_user_authorizer())</code>{" "}
          だけで済み、認証失敗は依存の中で HTTPException に変換されます。疎結合の極意は「失敗処理を一箇所に集約する」ことです。
        </p>

        <h3>認可の合成</h3>
        <pre className="code">{ARTICLE_CODE}</pre>
        <p>
          記事取得依存の中で、オプショナル認証・Repository・Path
          パラメータが合成されています。さらに{" "}
          <code>check_article_modification_permissions</code>{" "}
          のように「記事を取得した結果」を次の依存へ渡し、著者かどうかを判定しています。これは
          DI グラフが深くなる典型パターンで、読み方は「引数がどの依存の出力か」を辿ることです。
        </p>

        <h3>テスト容易性</h3>
        <p>
          FastAPI の <code>app.dependency_overrides</code>{" "}
          により、本番の get_db / get_current_user をテストダブルに差し替えられます。ルートを直接呼ばず、依存だけ置き換えてユニットテストする文化が、このディレクトリ構造とセットで成立します。
        </p>
      </section>

      <section className="di-layer di-layer-bottom">
        <h2>
          <span className="accent">02</span> ボトムアップ — ゼロから書くための文法
        </h2>
        <p>
          上記コードに出てきた Python / FastAPI
          構文を、自分で同型の依存を書けるレベルまで分解します。各項目は「文法ルール → なぜこのコードで使うか」の順です。
        </p>
        {GRAMMAR.map((g) => (
          <div key={g.tag} className="di-grammar">
            <h4>{g.tag}</h4>
            <p>{g.rule}</p>
            <p className="why">このコードでの理由: {g.why}</p>
            <pre className="code">{g.ex}</pre>
          </div>
        ))}
      </section>

      <section className="di-quiz">
        <h2>
          <span className="accent">03</span> Quiz
        </h2>
        {QUIZ.map((q) => (
          <div key={q.id} className="q-block">
            <p>{q.prompt}</p>
            {q.choices.map((c, i) => (
              <label key={i} className="opt">
                <input
                  type="radio"
                  name={q.id}
                  onChange={async () => {
                    const r = await submit("fastapi-di-realworld", q.id, i)
                    setQuizMsg((m) => ({
                      ...m,
                      [q.id]: `${r.correct ? "OK" : "NG"} — ${r.explanation}`,
                    }))
                  }}
                />
                {c}
              </label>
            ))}
            {quizMsg[q.id] ? (
              <div
                className={`feed ${quizMsg[q.id].startsWith("OK") ? "ok" : "ng"}`}
              >
                {quizMsg[q.id]}
              </div>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className="action"
          disabled={pending}
          onClick={onComplete}
        >
          完了を記録
        </button>
      </section>
    </article>
  )
}
