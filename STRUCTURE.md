# Code Foundations — 構成メモ
#
# 構成:
#   index.html          シェル（ヒーロー / 進捗 / カテゴリナビ / タブ枠のコンテナのみ）
#   content/{tab}.html  各タブのレッスン本文（遅延読込）
#   data/quizzes.js     クイズデータ
#   data/puzzles.js     パズルデータ
#   data/missions.js    編末 Mini Mission / 章末ルーブリック（読込後に注入）
#   app.js              UIロジック（TABS レジストリ・シェル生成・読込・進捗・クイズ・パズル・演習層）
#   style.css           スタイル
#   tests/smoke.js      ヘッドレススモークテスト
#
# タブのメタデータは app.js 冒頭の TABS レジストリに一元化されている。
# 進捗カード・タブボタン・コンテンツ枠・ヒーロー統計は
# 起動時に renderShell() が TABS から自動生成する（index.html の編集は不要）。
#
# タブ追加手順:
#   1. content/{id}.html を追加（既存タブの lesson-card 構造を踏襲）
#   2. data/quizzes.js / data/puzzles.js にキーを追加
#   3. app.js の TABS にエントリを追加
#      （label / icon / group / lessons / accent / glow。表示順 = 記述順）
#   4. npm test で確認
#
# 注意: TABS の lessons は content/{id}.html の lesson-card 数と
#       一致させること（CIが検証する）。ヒーロー統計は自動算出される。
#
# 特殊コンポーネント:
#   SQLプレイグラウンド (content/database.html + app.js 後半)
#     sql.js(WASM) を CDN から遅延ロードし、ブラウザ内SQLiteで
#     クエリを実行する。シードデータは app.js の SQL_SEED。
#   学習ロードマップ (app.js の ROADMAP 定数。ラベル等は TABS から導出)
#     推奨学習順のステッパー。進捗率と連動。
#   全文検索 (app.js の buildSearchIndex / searchLessons)
#     初回フォーカス時に content/*.html を fetch してインデックス構築。
#   コード実行 (app.js の attachRunButtons)
#     Python/JS ラベルのコードブロックに「▶ 実行」を自動付与。
#     JS は Web Worker サンドボックス、Python は Pyodide(CDN遅延ロード)。
#   進捗エクスポート/インポート (app.js の exportProgress / importProgress)
