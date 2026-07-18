// ============================================================
// data/taskboard.js — 各章末「TaskBoard に適用する」ブロック
// app.js の injectTaskBoardApply が quiz 直前に注入する。
// ============================================================
const taskBoardApplyData = {
  htmlcss: {
    pathway: "pathway-2",
    minutes: 20,
    goal: "TaskBoard の静的 UI 骨格をセマンティック HTML と Flex で組む",
    tasks: [
      "header / main / form / ul でタスク画面の骨格を作る",
      "入力欄と「追加」ボタンを Flex で横並びにし、狭い幅では縦積みにする",
      "完了タスクに打ち消し線用のクラスを用意する（見た目だけでも可）",
    ],
  },
  javascript: {
    pathway: "pathway-3",
    minutes: 25,
    goal: "localStorage で TaskBoard の CRUD を動かす",
    tasks: [
      "tasks 配列を localStorage に保存・復元する",
      "追加 / 完了トグル / 削除をイベントで実装する",
      "空タイトルは追加できないバリデーションを入れる",
    ],
  },
  python: {
    pathway: "pathway-6",
    minutes: 25,
    goal: "Task モデルとバリデーションを Python で表現する",
    tasks: [
      "id / title / done を持つ dict または dataclass を定義する",
      "title が空なら ValueError（または同等）にする関数を書く",
      "一覧・追加・トグルの純関数を 3 つ用意する（I/O は後回しで可）",
    ],
  },
  git: {
    pathway: "pathway-4",
    minutes: 15,
    goal: "TaskBoard リポジトリの最初の履歴を残す",
    tasks: [
      "feature ブランチを切って UI か JS の変更をコミットする",
      "意味のあるコミットメッセージを 1 つ書く",
      "README に「動かし方（ファイルを開くだけ）」を 3 行で書く",
    ],
  },
  linux: {
    pathway: "pathway-9",
    minutes: 15,
    goal: "TaskBoard を CLI で起動・疎通確認する習慣をつける",
    tasks: [
      "作業ディレクトリへ cd し、ls で構成を確認する",
      "curl またはブラウザ相当で /health（または index）を叩く手順をメモする",
      "環境変数で PORT を切り替える想定を 1 行書く",
    ],
  },
  database: {
    pathway: "pathway-6",
    minutes: 25,
    goal: "tasks テーブルを設計し、CRUD SQL を書く",
    tasks: [
      "id / title / done / created_at のテーブル定義を書く",
      "INSERT / SELECT / UPDATE done / DELETE の 4 文を用意する",
      "user_id を後から足すときの ALTER 方針を 1 行決める",
    ],
  },
  webapi: {
    pathway: "pathway-5",
    minutes: 25,
    goal: "TaskBoard の REST 契約を OpenAPI 風に固定する",
    tasks: [
      "GET/POST /tasks と PATCH/DELETE /tasks/{id} の入出力を表にする",
      "401 / 403 / 404 / 422 の使い分けを決める",
      "エラー JSON の形（detail など）を 1 つに統一する",
    ],
  },
  docker: {
    pathway: "pathway-9",
    minutes: 25,
    goal: "TaskBoard を Compose で API + DB 起動する",
    tasks: [
      "api と db サービスの docker-compose.yml 骨格を書く",
      "DB パスワードを環境変数にし、イメージに焼かない",
      "/health の HEALTHCHECK または手動 curl 手順を書く",
    ],
  },
  cicd: {
    pathway: "pathway-10",
    minutes: 25,
    goal: "TaskBoard の PR でテストが走るパイプラインを設計する",
    tasks: [
      "unit ジョブの YAML 骨格を書く",
      "Required Checks に載せるジョブ名を決める",
      "シークレットを GitHub Secrets に置く項目を列挙する",
    ],
  },
  react: {
    pathway: "pathway-7",
    minutes: 25,
    goal: "TaskBoard 一覧を React コンポーネントに切り出す",
    tasks: [
      "TaskList / TaskItem / TaskForm に分割する",
      "key に安定した id を使う",
      "完了トグルを親の state 更新として実装する（または設計する）",
    ],
  },
  typescript: {
    pathway: "pathway-7",
    minutes: 20,
    goal: "Task 型と API レスポンス型を TypeScript で固定する",
    tasks: [
      "type Task = { id: string; title: string; done: boolean } を定義する",
      "API レスポンスを型ガードまたは Zod で検証する方針を書く",
      "any を使わずに一覧描画の props を型付けする",
    ],
  },
  testing: {
    pathway: "pathway-8",
    minutes: 25,
    goal: "TaskBoard API の結合テスト方針を書く",
    tasks: [
      "所有者・他ユーザー・未認証の 3 ケースを列挙する",
      "pytest + TestClient で書く最初のテスト名を 2 つ決める",
      "CI の integration ジョブに載せることを明記する",
    ],
  },
  security: {
    pathway: "pathway-11",
    minutes: 20,
    goal: "TaskBoard 公開前チェックを実施する",
    tasks: [
      "XSS（innerHTML）と認可（所有者チェック）を点検する",
      "シークレットがリポジトリに無いことを確認する",
      "既知の制限を README に 3 つ書く",
    ],
  },
  algorithm: {
    pathway: "pathway-1",
    minutes: 15,
    goal: "TaskBoard の検索・ソート要件を計算量で見積もる",
    tasks: [
      "タイトル部分一致検索を O(n) 線形で良い理由を書く",
      "完了日でソートする場合の計算量を見積もる",
      "n が 1万件になったときのボトルネックを 1 つ挙げる",
    ],
  },
  rust: {
    pathway: "pathway-1",
    minutes: 20,
    goal: "Task 構造体で所有権を意識したモデルを書く（任意トラック）",
    tasks: [
      "struct Task { id, title, done } を定義する",
      "title を &str で受けて String に持つ関数を書く",
      "TaskBoard のどの層を Rust に置き換えうるか 1 行で書く",
    ],
  },
  devtools: {
    pathway: "pathway-3",
    minutes: 20,
    goal: "TaskBoard の不具合を DevTools で 15 分切り分けする",
    tasks: [
      "Network で API の status / レスポンスを確認する",
      "Application で localStorage の tasks を見る",
      "再現手順と仮説を 3 行でメモする",
    ],
  },
  sysdesign: {
    pathway: "pathway-12",
    minutes: 30,
    goal: "TaskBoard を 10x ユーザー向けに設計図へ落とす",
    tasks: [
      "現状の単一サーバー構成図を描く",
      "ボトルネック（DB / 静的配信 / 認証）を 1 つ選んで対策を書く",
      "キャップストーン提出物の『アーキテクチャ図』草案にする",
    ],
  },
};
