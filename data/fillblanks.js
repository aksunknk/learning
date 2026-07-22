// ============================================================
// data/fillblanks.js — 穴埋めドリル
// ___ が入力欄になる。
//   - JavaScript / Python: ▶ 実行して expect と照合
//   - その他（Shell / HTML / YAML 等）: ✓ 判定で answers と照合
// answers の各要素は文字列、または許容別名の配列。
// ============================================================
const fillBlankData = {
  javascript: [
    {
      id: "js-fb-sum",
      title: "配列を合計する",
      hint: "畳み込みに使う配列メソッド名を入れてください",
      lang: "JavaScript",
      template: `const nums = [1, 2, 3];
const sum = nums.___((a, b) => a + b, 0);
console.log(sum);`,
      answers: ["reduce"],
      expect: "6",
    },
    {
      id: "js-fb-filter",
      title: "未完了タスクだけ残す",
      hint: "条件に合う要素だけを残すメソッド",
      lang: "JavaScript",
      template: `const tasks = [
  { title: "learn", done: false },
  { title: "break", done: true },
  { title: "ship", done: false },
];
const open = tasks.___((t) => t.done === false);
console.log(open.map((t) => t.title).join(","));`,
      answers: ["filter"],
      expect: "learn,ship",
    },
    {
      id: "js-fb-json",
      title: "localStorage 用に直列化する",
      hint: "オブジェクト → 文字列",
      lang: "JavaScript",
      template: `const tasks = [{ id: "1", title: "ship", done: false }];
const raw = JSON.___(tasks);
console.log(typeof raw);
console.log(raw.includes("ship"));`,
      answers: ["stringify"],
      expect: "string\ntrue",
    },
  ],
  python: [
    {
      id: "py-fb-comp",
      title: "未完了タイトルをリスト内包で取り出す",
      hint: "内包表記の書き方を完成させてください",
      lang: "Python",
      template: `tasks = [
    {"title": "learn", "done": False},
    {"title": "break", "done": True},
    {"title": "ship", "done": False},
]
open_titles = [t["title"] for t in tasks if t["___"] is False]
print(",".join(open_titles))`,
      answers: ["done"],
      expect: "learn,ship",
    },
    {
      id: "py-fb-get",
      title: "dict.get でデフォルトを返す",
      hint: "キーが無いとき 0 を返すメソッド",
      lang: "Python",
      template: `counts = {"a": 2}
print(counts.___("b", 0))
print(counts.___("a", 0))`,
      answers: ["get", "get"],
      expect: "0\n2",
    },
    {
      id: "py-fb-join",
      title: "パスを安全につなぐ",
      hint: "pathlib の演算子、または文字列結合の定石",
      lang: "Python",
      template: `from pathlib import Path
base = Path("/app")
p = base / "data" / "tasks.___"
print(p.name)`,
      answers: ["json"],
      expect: "tasks.json",
    },
  ],

  htmlcss: [
    {
      id: "html-fb-main",
      title: "メインランドマーク",
      hint: "ページの主内容を示すセマンティック要素",
      lang: "HTML",
      mode: "answers",
      caseInsensitive: true,
      template: `<___>
  <h1>TaskBoard</h1>
</___>`,
      answers: ["main", "main"],
    },
    {
      id: "html-fb-label",
      title: "ラベルと入力を紐づける",
      hint: "for と id を一致させる",
      lang: "HTML",
      mode: "answers",
      template: `<label ___="title">タイトル</label>
<input id="title" type="text" />`,
      answers: ["for"],
    },
    {
      id: "css-fb-flex-center",
      title: "Flex で水平中央",
      hint: "主軸方向の中央寄せ",
      lang: "CSS",
      mode: "answers",
      template: `.row {
  display: flex;
  ___-content: center;
}`,
      answers: ["justify"],
    },
    {
      id: "css-fb-border-box",
      title: "サイズ計算を直感的に",
      hint: "padding/border を width に含める",
      lang: "CSS",
      mode: "answers",
      template: `*, *::before, *::after {
  box-sizing: ___;
}`,
      answers: ["border-box"],
    },
  ],

  git: [
    {
      id: "git-fb-status",
      title: "作業ツリーの状態を見る",
      hint: "変更・ステージの概要",
      lang: "Shell",
      mode: "answers",
      template: `$ git ___`,
      answers: ["status"],
    },
    {
      id: "git-fb-commit",
      title: "メッセージ付きコミット",
      hint: "短いメッセージを付ける定番フラグ",
      lang: "Shell",
      mode: "answers",
      template: `$ git commit ___ "fix login"`,
      answers: ["-m"],
    },
    {
      id: "git-fb-branch",
      title: "ブランチを切って移る",
      hint: "作成とチェックアウトを一度に",
      lang: "Shell",
      mode: "answers",
      caseInsensitive: true,
      template: `$ git switch ___ feature/login`,
      answers: [["-c", "-C"]],
    },
    {
      id: "git-fb-diff",
      title: "ステージ前の差分",
      hint: "ワーキングツリーとインデックスの差",
      lang: "Shell",
      mode: "answers",
      template: `$ git ___`,
      answers: ["diff"],
    },
  ],

  linux: [
    {
      id: "linux-fb-pwd",
      title: "今いる場所を表示",
      hint: "Print Working Directory",
      lang: "Shell",
      mode: "answers",
      template: `$ ___`,
      answers: ["pwd"],
    },
    {
      id: "linux-fb-pipe",
      title: "出力を次コマンドへ渡す",
      hint: "パイプ記号",
      lang: "Shell",
      mode: "answers",
      template: `$ cat app.log ___ grep ERROR`,
      answers: ["|"],
    },
    {
      id: "linux-fb-chmod",
      title: "秘密鍵の権限",
      hint: "所有者のみ読み書き",
      lang: "Shell",
      mode: "answers",
      template: `$ chmod ___ ~/.ssh/id_ed25519`,
      answers: ["600"],
    },
    {
      id: "linux-fb-export",
      title: "子プロセスへ渡す変数",
      hint: "環境変数にするコマンド",
      lang: "Shell",
      mode: "answers",
      template: `$ ___ DATABASE_URL=postgres://...`,
      answers: ["export"],
    },
  ],

  docker: [
    {
      id: "docker-fb-from",
      title: "ベースイメージを指定",
      hint: "Dockerfile の先頭命令",
      lang: "Dockerfile",
      mode: "answers",
      caseInsensitive: true,
      template: `___ python:3.12-slim
WORKDIR /app`,
      answers: ["FROM"],
    },
    {
      id: "docker-fb-copy",
      title: "依存定義を先にコピー",
      hint: "レイヤーキャッシュ用",
      lang: "Dockerfile",
      mode: "answers",
      caseInsensitive: true,
      template: `___ requirements.txt .
RUN pip install -r requirements.txt`,
      answers: ["COPY"],
    },
    {
      id: "docker-fb-compose-ports",
      title: "ホストへポート公開",
      hint: "compose のキー名",
      lang: "YAML",
      mode: "answers",
      template: `services:
  api:
    image: taskboard-api
    ___:
      - "8000:8000"`,
      answers: ["ports"],
    },
    {
      id: "docker-fb-volume",
      title: "データを永続化",
      hint: "compose のマウントキー",
      lang: "YAML",
      mode: "answers",
      template: `services:
  db:
    image: postgres:16
    ___:
      - pgdata:/var/lib/postgresql/data`,
      answers: ["volumes"],
    },
  ],

  cicd: [
    {
      id: "cicd-fb-workflow-path",
      title: "Actions の配置場所",
      hint: "ディレクトリ名",
      lang: "Path",
      mode: "answers",
      template: `.github/___/ci.yml`,
      answers: ["workflows"],
    },
    {
      id: "cicd-fb-on-push",
      title: "push で起動するトリガ",
      hint: "YAML のトップレベルキー",
      lang: "YAML",
      mode: "answers",
      template: `___:
  push:
    branches: [main]`,
      answers: ["on"],
    },
    {
      id: "cicd-fb-secrets",
      title: "秘密を参照する式",
      hint: "secrets コンテキスト",
      lang: "YAML",
      mode: "answers",
      template: `env:
  TOKEN: \${{ ___.DEPLOY_TOKEN }}`,
      answers: ["secrets"],
    },
    {
      id: "cicd-fb-runs-on",
      title: "ジョブの実行環境",
      hint: "ubuntu ランナーを指定するキー",
      lang: "YAML",
      mode: "answers",
      template: `jobs:
  test:
    ___: ubuntu-latest
    steps:
      - uses: actions/checkout@v4`,
      answers: ["runs-on"],
    },
  ],

  devtools: [
    {
      id: "devtools-fb-network",
      title: "通信を見るパネル",
      hint: "status / body を確認する場所",
      lang: "DevTools",
      mode: "answers",
      caseInsensitive: true,
      template: `データが空 → まず ___ パネル`,
      answers: ["Network"],
    },
    {
      id: "devtools-fb-application",
      title: "localStorage を見るパネル",
      hint: "ストレージ系",
      lang: "DevTools",
      mode: "answers",
      caseInsensitive: true,
      template: `tasks キーを確認 → ___ パネル`,
      answers: ["Application"],
    },
    {
      id: "devtools-fb-computed",
      title: "最終 CSS を確認",
      hint: "Elements 内のタブ名",
      lang: "DevTools",
      mode: "answers",
      caseInsensitive: true,
      template: `打ち消し線の勝ち負け → ___`,
      answers: ["Computed"],
    },
    {
      id: "devtools-fb-disable-cache",
      title: "開発中のキャッシュ無効化",
      hint: "Network パネルのチェック名（スペース区切り可）",
      lang: "DevTools",
      mode: "answers",
      caseInsensitive: true,
      template: `DevTools を開いた状態で ___ にチェック`,
      answers: [["Disable cache", "disable cache"]],
    },
  ],

  sysdesign: [
    {
      id: "sd-fb-stateless",
      title: "水平スケールの前提",
      hint: "セッションを外出ししたアプリの性質",
      lang: "Text",
      mode: "answers",
      caseInsensitive: true,
      template: `アプリを ___ にし、状態は DB/Redis へ`,
      answers: [["stateless", "ステートレス"]],
    },
    {
      id: "sd-fb-nfr",
      title: "非機能要件の略称",
      hint: "レイテンシ・可用性などの総称（英語略）",
      lang: "Text",
      mode: "answers",
      caseInsensitive: true,
      template: `性能・可用性は ___（非機能要件）として数値化する`,
      answers: ["NFR"],
    },
    {
      id: "sd-fb-cache",
      title: "読み取り優勢の定石",
      hint: "ホットな写像を置く場所",
      lang: "Text",
      mode: "answers",
      caseInsensitive: true,
      template: `短縮 URL の code→URL は ___ に載せる`,
      answers: [["cache", "キャッシュ"]],
    },
    {
      id: "sd-fb-adr",
      title: "設計決定の記録",
      hint: "Architecture Decision Record の略",
      lang: "Text",
      mode: "answers",
      caseInsensitive: true,
      template: `選んだ案と捨てた案を ___ に残す`,
      answers: ["ADR"],
    },
  ],
};
