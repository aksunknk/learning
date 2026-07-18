// ============================================================
// data/missions.js — 編末 Mini Mission と章末ルーブリック
// app.js がタブ読込後に注入する。追加・修正はこのファイルのみで行う。
// ============================================================
const missionData = {
  htmlcss: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 25,
      goal: "セマンティックな1カラムページを手書きで組み立てる",
      tasks: [
        "header / main / footer を持つ HTML を作る",
        "ナビと見出しに適切なタグを使う",
        "Flexbox でヘッダーを横並びにし、狭い幅で縦積みにする",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 30,
      goal: "カード＋モーダル相当の部品を BEM っぽいクラスで作る",
      tasks: [
        "カードコンポーネントを3つ並べる",
        "フォーカス可能なボタンと簡易ダイアログ（dialog または div）を用意する",
        "キーボードで閉じられることを確認する",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 30,
      goal: "ランディングのヒーローをモダン CSS で整える",
      tasks: [
        "clamp で流体タイポを使う",
        "prefers-reduced-motion を考慮したトランジションにする",
        "Lighthouse 相当の観点（画像寸法・見出し階層）を自己点検する",
      ],
    },
    rubric: [
      { id: "structure", label: "セマンティック HTML で骨格を説明できる" },
      { id: "layout", label: "Flex/Grid を用途で使い分けられる" },
      { id: "a11y", label: "キーボード操作とコントラストを意識できる" },
      { id: "css-arch", label: "クラス設計やレイヤの必要性を説明できる" },
    ],
  },

  javascript: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "配列操作でタスク一覧を整形する",
      tasks: [
        "オブジェクト配列から done:false だけを filter する",
        "title を大文字にした新配列を map で作る",
        "=== のみで比較し == を使わない",
      ],
      starter: {
        lang: "JavaScript",
        code: `const tasks = [
  { id: 1, title: "learn js", done: false },
  { id: 2, title: "break", done: true },
  { id: 3, title: "ship", done: false },
];
const open = tasks.filter((t) => t.done === false);
const titles = open.map((t) => t.title.toUpperCase());
console.log(titles);`,
      },
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "fetch 風の非同期処理を async/await で書く",
      tasks: [
        "Promise を返す wait(ms) を自作する",
        "async 関数内で await し、try/catch する",
        "失敗時にエラーメッセージを console に出す",
      ],
      starter: {
        lang: "JavaScript",
        code: `function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {
  try {
    await wait(100);
    console.log("ok");
  } catch (e) {
    console.error(e);
  }
}
main();`,
      },
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "イベントループの順序を予言して検証する",
      tasks: [
        "sync / promise / timeout の出力順を先に書き留める",
        "コードを実行して予想と一致するか確認する",
        "なぜその順か一文で説明する",
      ],
      starter: {
        lang: "JavaScript",
        code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// 予想順をコメントで残す:`,
      },
    },
    rubric: [
      { id: "types", label: "=== と Falsy を説明できる" },
      { id: "array", label: "map/filter でデータを変換できる" },
      { id: "async", label: "async/await とエラー処理ができる" },
      { id: "dom", label: "DOM イベントを安全に登録できる" },
    ],
  },

  python: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "関数とコレクションで小集計を書く",
      tasks: [
        "数値リストの合計と平均を関数にする",
        "辞書で名前→点数を持ち最高点の人を求める",
        "f-string で結果を表示する",
      ],
      starter: {
        lang: "Python",
        code: `scores = {"Ann": 80, "Bob": 95, "Cara": 88}

def summarize(d):
    vals = list(d.values())
    avg = sum(vals) / len(vals)
    top = max(d, key=d.get)
    return avg, top

avg, top = summarize(scores)
print(f"avg={avg:.1f}, top={top}")`,
      },
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "ファイルと例外を安全に扱う",
      tasks: [
        "with と encoding='utf-8' でテキストを書き込む",
        "存在しないファイルを開いたとき例外を捕まえる",
        "pathlib でパスを組み立てる",
      ],
      starter: {
        lang: "Python",
        code: `from pathlib import Path
p = Path("mission_note.txt")
try:
    p.write_text("hello\\n", encoding="utf-8")
    print(p.read_text(encoding="utf-8"))
except OSError as e:
    print("error", e)`,
      },
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "型ヒント付きの小さな関数を書く",
      tasks: [
        "引数と戻り値に型ヒントを付ける",
        "None を返し得る関数で絞り込みをしてから使う",
        "dataclass か Typed な dict のどちらかでデータを表す",
      ],
    },
    rubric: [
      { id: "basics", label: "関数とコレクションを迷わず書ける" },
      { id: "errors", label: "例外と with を使い分けられる" },
      { id: "types", label: "型ヒントの利点を説明できる" },
      { id: "api", label: "簡単な FastAPI エンドポイントの形がわかる" },
    ],
  },

  linux: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "作業ディレクトリを作りファイルを安全に扱う",
      tasks: [
        "mkdir -p でネストした作業フォルダを作る",
        "echo とリダイレクトでメモを書き、cat で確認する",
        "消す前に ls で対象を確認する習慣を実行する",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "パイプと環境変数で調査する",
      tasks: [
        "ps または ss の出力をパイプで絞り込む",
        "export した変数を printenv で確認する",
        "curl で HTTP ステータスだけ表示する",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "小さなシェルスクリプトを書いて実行する",
      tasks: [
        "set -euo pipefail を冒頭に置く",
        "引数またはデフォルト値で出力先を変える",
        "chmod +x して実行する",
      ],
    },
    rubric: [
      { id: "nav", label: "pwd/ls/cd で迷子にならない" },
      { id: "pipe", label: "パイプとリダイレクトを使える" },
      { id: "ssh", label: "SSH 鍵の注意点を説明できる" },
      { id: "ops", label: "ログの見方（journalctl 等）を知っている" },
    ],
  },

  database: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "プレイグラウンドで SELECT / JOIN を書く",
      tasks: [
        "users 全件を取得する",
        "orders と users を JOIN する",
        "WHERE で条件を絞る",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "集計とインデックスの意味を確認する",
      tasks: [
        "GROUP BY で件数を集計する",
        "EXPLAIN QUERY PLAN で計画を見る",
        "N+1 がなぜ遅いか一文で説明する",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "運用視点のチェックリストを埋める",
      tasks: [
        "マイグレーションの expand/contract を自分の言葉で書く",
        "バックアップの『戻し方』を1手順書く",
        "コネクションプールが必要な理由を書く",
      ],
    },
    rubric: [
      { id: "sql", label: "SELECT/JOIN/集計を書ける" },
      { id: "txn", label: "トランザクションの必要性を説明できる" },
      { id: "perf", label: "インデックスと N+1 を説明できる" },
      { id: "ops", label: "マイグレーションとバックアップを意識できる" },
    ],
  },

  webapi: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "小さな REST 契約を紙に書く",
      tasks: [
        "リソース名でパスを3本定義する",
        "成功/失敗のステータスを決める",
        "エラー JSON の形を1つに固定する",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "一覧 API のクエリ設計をする",
      tasks: [
        "limit と cursor（または offset）を決める",
        "Cache-Control を public/private どちらか選ぶ",
        "401/403/404 の使い分けを書く",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "耐障害とバージョニングを決める",
      tasks: [
        "冪等キーが必要な操作を1つ挙げる",
        "レート制限超過時の応答（429）を決める",
        "破壊的変更時のバージョン方針を一文で書く",
      ],
    },
    rubric: [
      { id: "http", label: "HTTP メソッドとステータスを説明できる" },
      { id: "contract", label: "エラーとページングの契約を設計できる" },
      { id: "cache", label: "キャッシュ方針を選べる" },
      { id: "evolve", label: "API の進化（互換）を意識できる" },
    ],
  },

  docker: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "最小 Dockerfile を読む／書く",
      tasks: [
        "FROM / WORKDIR / COPY / RUN / CMD の役割を言う",
        "自分のアプリ用の最小 Dockerfile 草案を書く",
        "イメージとコンテナの違いを説明できる",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "Compose とヘルスチェックを設計する",
      tasks: [
        "depends_on の限界を説明できる",
        "healthcheck の test コマンドを1つ書く",
        ".dockerignore に入れる項目を5つ挙げる",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "本番寄りの Compose を分ける",
      tasks: [
        "dev 用 override にだけバインドマウントを置く",
        "memory limit を決める",
        "ログの追い方（compose logs）を実行または手順化する",
      ],
    },
    rubric: [
      { id: "image", label: "Dockerfile の基本を説明できる" },
      { id: "compose", label: "Compose で複数サービスを起動できる" },
      { id: "debug", label: "logs/exec で切り分けできる" },
      { id: "prod", label: "秘密とリソース制限を意識できる" },
    ],
  },

  cicd: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "最小の GitHub Actions ワークフローを書く",
      tasks: [
        ".github/workflows/ci.yml の骨格を作る",
        "checkout とテストコマンドを入れる",
        "Actions タブでログを見る手順を確認する",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "シークレットと環境を分ける",
      tasks: [
        "secrets に直書きしない理由を説明できる",
        "staging / production で分けるものを列挙する",
        "デプロイ後の /health 確認手順を書く",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 20,
      goal: "速い CI と観測の最小セットを決める",
      tasks: [
        "cache または npm ci の方針を決める",
        "デプロイ直後チェックリストを3項目作る",
        "ロールバック手段を一文で書く",
      ],
    },
    rubric: [
      { id: "ci", label: "PR でテストが走る状態を作れる" },
      { id: "secret", label: "Secrets の扱いを説明できる" },
      { id: "deploy", label: "staging/prod の分離を説明できる" },
      { id: "rollback", label: "戻し方を持っている" },
    ],
  },

  react: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 25,
      goal: "useState で小さなリスト UI を作る",
      tasks: [
        "入力と追加ボタンで配列に要素を足す",
        "key に index を使わない",
        "条件付きで空状態を表示する",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "useEffect で取得しクリーンアップする",
      tasks: [
        "マウント時にデータ取得する",
        "AbortController または無視フラグで競合を防ぐ",
        "loading / error 状態を分ける",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "カスタムフックに切り出す",
      tasks: [
        "useXxx として取得ロジックを分離する",
        "フックのルール（トップレベル呼び出し）を守る",
        "不要な再レンダーが起きないか確認する",
      ],
    },
    rubric: [
      { id: "state", label: "useState で UI を制御できる" },
      { id: "effect", label: "useEffect の依存配列を説明できる" },
      { id: "list", label: "key の意味を説明できる" },
      { id: "hooks", label: "カスタムフックに分割できる" },
    ],
  },

  typescript: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "関数とオブジェクトに型を付ける",
      tasks: [
        "引数と戻り値の型を明示する",
        "type または interface で User を定義する",
        "union でステータスを表す",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "as const と satisfies を使う",
      tasks: [
        "定数配列から union を導出する",
        "satisfies で設定オブジェクトを検査する",
        "any を使わずに書く",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "境界で Zod（または同等）の必要性を説明する",
      tasks: [
        "unknown で JSON を受ける理由を書く",
        "型ガードまたはスキーマ検証の箇所を決める",
        "Utility type を1つ使って型を変換する",
      ],
    },
    rubric: [
      { id: "basic", label: "基本型と interface を使える" },
      { id: "narrow", label: "絞り込みと union を使える" },
      { id: "generics", label: "ジェネリクスの利点を説明できる" },
      { id: "runtime", label: "実行時検証が必要な境界を知っている" },
    ],
  },

  security: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "典型攻撃と対策を対応づける",
      tasks: [
        "XSS / CSRF / SQLi を一言で定義する",
        "それぞれ対策を1つ挙げる",
        "パスワード保存に bcrypt 等を選ぶ理由を書く",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "認可とシークレットの設計をする",
      tasks: [
        "IDOR チェック箇所を API に書き込む",
        ".env を Git 管理しない手順を確認する",
        "CORS * + credentials が駄目な理由を書く",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 20,
      goal: "公開前チェックリストを適用する",
      tasks: [
        "自分のアプリ（または TaskBoard）に OWASP チェックを当てる",
        "未実施項目を『既知の制限』として残す",
        "依存 audit の実行方法を1つ覚える",
      ],
    },
    rubric: [
      { id: "attacks", label: "XSS/CSRF/SQLi を説明できる" },
      { id: "authz", label: "認証と認可の違いを説明できる" },
      { id: "secrets", label: "シークレット管理ができる" },
      { id: "ship", label: "公開前点検を実施できる" },
    ],
  },

  pathway: {
    beginner: {
      title: "初級編ミニミッション（総仕上げ）",
      minutes: 30,
      goal: "TaskBoard の localStorage 版を完成させる",
      tasks: [
        "追加・完了・削除が動く",
        "リロード後も残る",
        "README に現状を書く",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション（総仕上げ）",
      minutes: 40,
      goal: "API 契約どおりにサーバーへ移す",
      tasks: [
        "curl で CRUD が通る",
        "空 title が 422 になる",
        "自動テストを1本以上書く",
      ],
    },
    advanced: {
      title: "上級編ミニミッション（総仕上げ）",
      minutes: 40,
      goal: "Compose と公開前点検まで到達する",
      tasks: [
        "docker compose up で起動できる",
        "CI または同等のテスト手順がある",
        "セキュリティチェックリストを適用した",
      ],
    },
    rubric: [
      { id: "vertical", label: "層をまたいだ完成順序を説明できる" },
      { id: "contract", label: "API 契約を先に固定できる" },
      { id: "ship", label: "Docker/CI/点検まで到達できる" },
      { id: "story", label: "進化の記録をポートフォリオに残せる" },
    ],
  },

  git: {
    mission: {
      title: "章末ミニミッション",
      minutes: 20,
      goal: "機能ブランチで1変更を PR まで持っていく",
      tasks: [
        "git switch -c でブランチを切る",
        "意味のあるコミットメッセージで commit する",
        "push して PR 作成手順を確認する",
      ],
    },
    rubric: [
      { id: "stage", label: "stage/commit の違いを説明できる" },
      { id: "branch", label: "ブランチ運用ができる" },
      { id: "conflict", label: "コンフリクト対処の流れを知っている" },
      { id: "pr", label: "PR の目的を説明できる" },
    ],
  },

  sysdesign: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 25,
      goal: "TaskBoard の機能要件と NFR を1枚に書く",
      tasks: [
        "機能を 4 つ以内に列挙する",
        "レイテンシ・可用性・一貫性を仮置きする",
        "クライアント / API / DB の責務を3行で書く",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 30,
      goal: "スケール手段のトレードオフ表を作る",
      tasks: [
        "現状構成（単一 API + DB）を図示する",
        "キャッシュと水平スケールの長所/短所を表にする",
        "最初に測るメトリクスを 2 つ選ぶ",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 35,
      goal: "ADR 1 本と 10x 進化図を書く",
      tasks: [
        "永続化または認証配置の ADR を1本書く",
        "Phase 0 と Phase 1 の構成差分を書く",
        "既知の制限を 3 つ『次の宿題』として残す",
      ],
    },
    rubric: [
      { id: "nfr", label: "機能要件と NFR を分けて書ける" },
      { id: "scale", label: "垂直/水平とステートレスを説明できる" },
      { id: "consistency", label: "強整合/結果整合の使い分けを説明できる" },
      { id: "adr", label: "トレードオフを ADR または表に残せる" },
    ],
  },

  devtools: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "Elements / Console / Network を一巡する",
      tasks: [
        "適当なページで要素を選択し Computed を見る",
        "Console でオブジェクトを console.log する",
        "Network で文書または XHR の status を読む",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "TaskBoard（または演習ページ）の状態を Application で確認する",
      tasks: [
        "localStorage のキーを列挙する",
        "値をバックアップしてから壊し、リロード挙動を見る",
        "Sources で 1 箇所ブレークポイントを止める",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "15 分ランブックで架空障害を切り分ける",
      tasks: [
        "症状を1文、仮説を2つ書く",
        "使うパネル順を書き、証拠の取り方を決める",
        "修正 or Issue テンプレを 5 行で残す",
      ],
    },
    rubric: [
      { id: "map", label: "症状から初期パネルを選べる" },
      { id: "network", label: "Network で status/body を読める" },
      { id: "storage", label: "Application で永続状態を確認できる" },
      { id: "runbook", label: "切り分け手順を時間区切りで実行できる" },
    ],
  },

  testing: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "境界値と同値クラスを表に落とす",
      tasks: [
        "入力1つについて有効/無効の同値クラスを書く",
        "境界とその前後の値を3つ以上挙げる",
        "どのレベル（単体/結合/E2E）で見るか1行で決める",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "失敗するテストを先に書いてから通す",
      tasks: [
        "期待結果を断言するテストを1本書く",
        "一度赤になることを確認する",
        "実装して緑にする",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 30,
      goal: "API 結合テストを CI の必須チェックに載せる設計をする",
      tasks: [
        "認可の成功/拒否を含む結合テスト方針を書く",
        "unit と integration のジョブ分割を YAML 骨格で書く",
        "Required Checks に載せるジョブ名を決める",
      ],
    },
    rubric: [
      { id: "pyramid", label: "テストピラミッドを説明できる" },
      { id: "unit", label: "単体テストを書ける" },
      { id: "design", label: "同値分割/境界値を使える" },
      { id: "api", label: "API 結合・契約テストの役割を説明できる" },
      { id: "ci", label: "Required Checks で品質ゲートにできる" },
    ],
  },

  capstone: {
    mission: {
      title: "章末ミニミッション",
      minutes: 45,
      goal: "提出物4点セットの草案を作る",
      tasks: [
        "動かし方（URL または compose）を書く",
        "アーキテクチャ図のラフを描く",
        "既知の制限を3つ書く",
      ],
    },
    rubric: [
      { id: "scope", label: "スコープを切って完成させられる" },
      { id: "auth", label: "認証認可を設計に含められる" },
      { id: "quality", label: "テストとデプロイを含められる" },
      { id: "demo", label: "デモと説明ができる" },
    ],
  },

  algorithm: {
    mission: {
      title: "章末ミニミッション",
      minutes: 25,
      goal: "1アルゴリズムを自分の言葉とコードで再現する",
      tasks: [
        "問題を入出力で定義する",
        "計算量を O記法で見積もる",
        "テストケースを3つ用意する",
      ],
    },
    rubric: [
      { id: "bigO", label: "計算量の見方を説明できる" },
      { id: "search", label: "探索/ソートの基本を実装できる" },
      { id: "structure", label: "基本データ構造を説明できる" },
      { id: "test", label: "境界のテストを考えられる" },
    ],
  },

  rust: {
    beginner: {
      title: "初級編ミニミッション",
      minutes: 20,
      goal: "cargo で小さなプログラムを動かす",
      tasks: [
        "cargo new でプロジェクトを作る",
        "println! で出力する",
        "mut が必要な場面を1つ作る",
      ],
    },
    intermediate: {
      title: "中級編ミニミッション",
      minutes: 25,
      goal: "所有権と借用をコンパイルで確認する",
      tasks: [
        "ムーブ後に使えない例を意図的に見て直す",
        "参照で読めば十分な関数を書く",
        "Vec を iter で処理する",
      ],
    },
    advanced: {
      title: "上級編ミニミッション",
      minutes: 25,
      goal: "Result とテストを書く",
      tasks: [
        "? を使った関数を書く",
        "#[test] を1本以上通す",
        "失敗ケースを assert する",
      ],
    },
    rubric: [
      { id: "own", label: "所有権/借用を説明できる" },
      { id: "err", label: "Result/? を使える" },
      { id: "type", label: "struct/enum を使える" },
      { id: "test", label: "cargo test を回せる" },
    ],
  },
};
