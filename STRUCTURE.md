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
#   学習ロードマップ (app.js の ROADMAP 定数)
#     推奨学習順のステッパー。進捗率と連動。
#   全文検索 (app.js の buildSearchIndex / searchLessons)
#     初回フォーカス時に content/*.html を fetch してインデックス構築。
#   コード実行 (app.js の attachRunButtons)
#     Python/JS ラベルのコードブロックに「▶ 実行」を自動付与。
#     JS は Web Worker サンドボックス、Python は Pyodide(CDN遅延ロード)。
#   進捗エクスポート/インポート (app.js の exportProgress / importProgress)
#
# 注意: レッスンを増減させたら app.js の TAB_LESSON_COUNTS と
#       index.html のヒーロー統計を更新すること（CIが不一致を検出する）。
