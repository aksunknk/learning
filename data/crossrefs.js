// ============================================================
// data/crossrefs.js — レッスン間クロスリファレンス
// app.js が各 lesson-card 末尾に注入する。双方向になるよう両側に書く。
// ============================================================
const crossRefData = {
  // --- Security ---
  "security-2": [
    { tab: "javascript", section: "javascript-10", label: "DOM 操作と XSS 回避" },
    { tab: "webapi", section: "webapi-9", label: "エラー応答を晒しすぎない" },
  ],
  "security-3": [
    { tab: "security", section: "security-9", label: "Cookie / SameSite" },
    { tab: "webapi", section: "webapi-1", label: "HTTP と Cookie の前提" },
  ],
  "security-4": [
    { tab: "database", section: "database-11", label: "SQL インジェクション（DB章）" },
    { tab: "webapi", section: "webapi-3", label: "FastAPI とバリデーション" },
  ],
  "security-5": [
    { tab: "security", section: "security-7", label: "セッションと JWT" },
    { tab: "capstone", section: "capstone-5", label: "キャップストーンの認証" },
  ],
  "security-6": [
    { tab: "webapi", section: "webapi-6", label: "REST リソース設計" },
    { tab: "testing", section: "testing-11", label: "API 結合テストで認可を固定" },
  ],
  "security-7": [
    { tab: "webapi", section: "webapi-1", label: "HTTP / Authorization" },
    { tab: "security", section: "security-9", label: "Cookie と CORS" },
  ],
  "security-8": [
    { tab: "cicd", section: "cicd-5", label: "Actions Secrets" },
    { tab: "docker", section: "docker-7", label: "Docker セキュリティ" },
    { tab: "linux", section: "linux-8", label: "環境変数と PATH" },
  ],
  "security-9": [
    { tab: "webapi", section: "webapi-4", label: "フロントからの API 通信" },
    { tab: "security", section: "security-3", label: "CSRF" },
  ],
  "security-10": [
    { tab: "webapi", section: "webapi-12", label: "DNS と TLS" },
    { tab: "cicd", section: "cicd-6", label: "静的サイトの HTTPS 配信" },
  ],
  "security-11": [
    { tab: "cicd", section: "cicd-4", label: "PR 必須チェック" },
    { tab: "testing", section: "testing-13", label: "CI でテストと audit を回す" },
  ],
  "security-12": [
    { tab: "pathway", section: "pathway-11", label: "TaskBoard 公開前点検" },
    { tab: "cicd", section: "cicd-12", label: "PR から本番までの一本道" },
  ],

  // --- Web/API ---
  "webapi-1": [
    { tab: "security", section: "security-7", label: "セッションと JWT" },
    { tab: "webapi", section: "webapi-12", label: "DNS と TLS" },
  ],
  "webapi-6": [
    { tab: "pathway", section: "pathway-5", label: "TaskBoard の REST 契約" },
    { tab: "security", section: "security-6", label: "認可と IDOR" },
  ],
  "webapi-9": [
    { tab: "testing", section: "testing-11", label: "API 結合テスト" },
    { tab: "security", section: "security-2", label: "XSS（詳細を晒さない）" },
  ],
  "webapi-10": [
    { tab: "cicd", section: "cicd-6", label: "静的配信とキャッシュ" },
    { tab: "security", section: "security-9", label: "認証付き応答の Cache-Control" },
  ],
  "webapi-11": [
    { tab: "testing", section: "testing-12", label: "契約テストと OpenAPI" },
    { tab: "typescript", section: "typescript-15", label: "Zod と実行時検証" },
  ],
  "webapi-12": [
    { tab: "security", section: "security-10", label: "HTTPS とセキュリティヘッダ" },
    { tab: "linux", section: "linux-10", label: "curl / ss での疎通確認" },
  ],
  "webapi-13": [
    { tab: "cicd", section: "cicd-9", label: "ヘルスチェックとロールバック" },
    { tab: "testing", section: "testing-11", label: "リトライをテストで押さえる" },
  ],

  // --- CI/CD ---
  "cicd-4": [
    { tab: "testing", section: "testing-13", label: "Required Checks とテスト戦略" },
    { tab: "security", section: "security-11", label: "依存脆弱性の検出" },
  ],
  "cicd-5": [
    { tab: "security", section: "security-8", label: "シークレット管理" },
    { tab: "docker", section: "docker-7", label: "イメージに秘密を焼かない" },
  ],
  "cicd-7": [
    { tab: "docker", section: "docker-4", label: "docker compose" },
    { tab: "docker", section: "docker-6", label: "実務ワークフロー" },
    { tab: "pathway", section: "pathway-10", label: "TaskBoard の CI デプロイ" },
  ],
  "cicd-9": [
    { tab: "docker", section: "docker-10", label: "HEALTHCHECK" },
    { tab: "webapi", section: "webapi-13", label: "冪等性・リトライ" },
  ],
  "cicd-10": [
    { tab: "docker", section: "docker-14", label: "BuildKit キャッシュ" },
    { tab: "testing", section: "testing-13", label: "CI を速く保つ" },
  ],
  "cicd-12": [
    { tab: "pathway", section: "pathway-12", label: "通しプロジェクトの提出物" },
    { tab: "security", section: "security-12", label: "OWASP チェックリスト" },
  ],

  // --- Docker ---
  "docker-4": [
    { tab: "pathway", section: "pathway-9", label: "TaskBoard を Compose で起動" },
    { tab: "cicd", section: "cicd-7", label: "コンテナのデプロイ" },
  ],
  "docker-5": [
    { tab: "database", section: "database-15", label: "バックアップと永続化" },
    { tab: "linux", section: "linux-5", label: "権限とマウント" },
  ],
  "docker-7": [
    { tab: "security", section: "security-8", label: "シークレット管理" },
    { tab: "cicd", section: "cicd-5", label: "Actions Secrets" },
  ],
  "docker-10": [
    { tab: "cicd", section: "cicd-9", label: "ヘルスチェックとロールバック" },
    { tab: "webapi", section: "webapi-1", label: "/health の HTTP 契約" },
  ],
  "docker-14": [
    { tab: "cicd", section: "cicd-10", label: "CI の cache / matrix" },
    { tab: "linux", section: "linux-1", label: "CI ランナーは Linux" },
  ],

  // --- Testing（既存 + 新規 ID も先に登録）---
  "testing-8": [
    { tab: "webapi", section: "webapi-4", label: "フロントの通信と中断" },
    { tab: "python", section: "python-14", label: "型ヒントとモックしやすい境界" },
  ],
  "testing-9": [
    { tab: "webapi", section: "webapi-3", label: "FastAPI エンドポイント" },
    { tab: "pathway", section: "pathway-8", label: "TaskBoard の API テスト" },
  ],
  "testing-10": [
    { tab: "cicd", section: "cicd-4", label: "PR チェックを必須にする" },
    { tab: "cicd", section: "cicd-1", label: "なぜ CI/CD が必要か" },
  ],
  "testing-11": [
    { tab: "webapi", section: "webapi-9", label: "エラーレスポンス契約" },
    { tab: "security", section: "security-6", label: "認可と IDOR" },
    { tab: "pathway", section: "pathway-8", label: "縦糸の回帰テスト" },
  ],
  "testing-12": [
    { tab: "webapi", section: "webapi-11", label: "OpenAPI" },
    { tab: "react", section: "react-15", label: "リストと key（フロント検証）" },
  ],
  "testing-13": [
    { tab: "cicd", section: "cicd-4", label: "Required Checks" },
    { tab: "cicd", section: "cicd-5", label: "CI のシークレット" },
    { tab: "docker", section: "docker-14", label: "BuildKit で CI を速く" },
  ],
  "testing-14": [
    { tab: "cicd", section: "cicd-9", label: "デプロイ後スモーク" },
    { tab: "pathway", section: "pathway-10", label: "縦糸の CI/CD" },
  ],

  // --- Pathway / Database / Linux（補強）---
  "pathway-8": [
    { tab: "testing", section: "testing-11", label: "API 結合テスト" },
    { tab: "testing", section: "testing-6", label: "TDD" },
  ],
  "pathway-9": [
    { tab: "docker", section: "docker-4", label: "docker compose" },
    { tab: "docker", section: "docker-10", label: "HEALTHCHECK" },
  ],
  "pathway-10": [
    { tab: "cicd", section: "cicd-2", label: "GitHub Actions 入門" },
    { tab: "testing", section: "testing-13", label: "CI とテスト戦略" },
  ],
  "pathway-11": [
    { tab: "security", section: "security-12", label: "OWASP チェックリスト" },
    { tab: "security", section: "security-8", label: "シークレット管理" },
  ],
  "database-11": [
    { tab: "security", section: "security-4", label: "SQL インジェクション（セキュリティ章）" },
    { tab: "webapi", section: "webapi-3", label: "ORM/SQL とプレースホルダ" },
  ],
  "linux-8": [
    { tab: "security", section: "security-8", label: "シークレット管理" },
    { tab: "cicd", section: "cicd-5", label: "CI の環境変数" },
  ],
};
