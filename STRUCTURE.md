# WBS Phase 1 — 基盤整備メモ
#
# 構成:
#   index.html          シェル（ヒーロー / 進捗 / カテゴリナビ / タブ枠）
#   content/{tab}.html  各タブのレッスン本文（遅延読込）
#   data/quizzes.js     クイズデータ
#   data/puzzles.js     パズルデータ
#   app.js              UIロジック（読込・進捗・クイズ・パズル）
#   style.css           スタイル
#   tests/smoke.js      ヘッドレススモークテスト
#
# タブ追加手順:
#   1. content/{id}.html を追加
#   2. data/quizzes.js / data/puzzles.js にキーを追加
#   3. app.js の TAB_IDS / TAB_ACCENTS を更新
#   4. index.html に進捗カード・タブボタン・content 枠を追加
#      （body の data-total-lessons とヒーロー統計も更新）
#   5. npm test で確認
#
# 特殊コンポーネント:
#   SQLプレイグラウンド (content/database.html + app.js 後半)
#     sql.js(WASM) を CDN から遅延ロードし、ブラウザ内SQLiteで
#     クエリを実行する。シードデータは app.js の SQL_SEED。
