import json

python_lessons = [
    {
        "id": 6,
        "title": "データ構造の極意（辞書とタプルの使い分け）",
        "summary": "リストだけでは対応できない実務のデータ設計",
        "sections": [
            {
                "heading": "なぜリスト以外が必要なのか？",
                "body": "リストは「順番のあるデータの列」を扱うのには最適ですが、「名前で検索したい」「絶対に書き換えられたくない」場合には不向きです。実務では辞書（dict）やタプル（tuple）を使い分けます。",
                "code": "user = {'id': 1, 'name': 'Alice'}\npoint = (10, 20)  # 一度作ったら変更できない（イミュータブル）"
            },
            {
                "heading": "辞書の高度な使い方",
                "body": "APIのJSONレスポンスはPythonではほぼ辞書として扱われます。キーの存在確認やデフォルト値の取得は、エラーを防ぐ基本です。",
                "code": "# ❌ キーがないとエラーになる\n# name = user['nickname']\n\n# ✅ getメソッドで安全に取得\nnickname = user.get('nickname', '名無し')\n\n# キーと値のループ\nfor key, value in user.items():\n    print(f'{key}: {value}')"
            }
        ]
    },
    {
        "id": 7,
        "title": "堅牢なコードの要（try-exceptによる例外処理）",
        "summary": "AIのコードによく欠けている「エラー発生時の備え」",
        "sections": [
            {
                "heading": "プログラムを止めないためのtry-except",
                "body": "API通信のエラー、ファイルの読み込み失敗、0での割り算など、予期せぬエラーでアプリ全体がクラッシュするのを防ぎます。AIは正常系のコードを書きがちなので、手動で補強するスキルが重要です。",
                "code": "try:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f'ゼロで割れません: {e}')\nexcept Exception as e:\n    print(f'予期せぬエラー: {e}')\nfinally:\n    print('処理が終了しました')"
            }
        ]
    },
    {
        "id": 8,
        "title": "よくあるエラーとアンチパターン",
        "summary": "初学者が陥りやすい罠と解決策",
        "sections": [
            {
                "heading": "インデントエラーとスコープ",
                "body": "Pythonはインデント（字下げ）でブロックを認識します。スペース4つが標準ですが、タブとスペースが混在するとエラーになります。また、ループの中で変数を定義すると思わぬ上書き（スコープの汚染）が起きます。",
                "code": "# ❌ 悪い例（リストの破壊的変更）\nnums = [1, 2, 3]\nfor n in nums:\n    if n == 2:\n        nums.remove(n)  # ループ中に要素を消すと挙動がおかしくなる\n\n# ✅ 良い例（新しいリストを作る）\nnew_nums = [n for n in nums if n != 2]"
            }
        ]
    },
    {
        "id": 9,
        "title": "Final Mission: FastAPIによるTodoバックエンド構築",
        "summary": "APIサーバーを作って、フロントと通信してみよう",
        "sections": [
            {
                "heading": "FastAPIとPydanticの連携",
                "body": "実際のAPIでは、「どんなデータが送られてくるか」をPydanticのSchema（型）で定義し、FastAPIのルーターと結びつけます。これにより、自動的にバリデーション（入力値チェック）が行われます。",
                "code": "from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nfrom typing import List\n\napp = FastAPI()\n\nclass Task(BaseModel):\n    id: int\n    title: str\n    completed: bool = False\n\ntasks_db = []\n\n@app.get('/tasks', response_model=List[Task])\ndef get_tasks():\n    return tasks_db\n\n@app.post('/tasks', response_model=Task)\ndef create_task(task: Task):\n    tasks_db.append(task)\n    return task"
            },
            {
                "heading": "CORS（Cross-Origin Resource Sharing）の設定",
                "body": "Reactなどのフロントエンド（例: localhost:3000）からAPI（localhost:8000）を呼び出す場合、ポート番号が違うためブラウザが通信をブロックします。これを許可するのがCORS設定です。",
                "code": "from fastapi.middleware.cors import CORSMiddleware\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=['*'],  # 実際はフロントのURLを指定する\n    allow_methods=['*'],\n    allow_headers=['*'],\n)"
            }
        ]
    }
]

def generate_html(lang, lessons):
    html = []
    for l in lessons:
        num = l["id"]
        num_str = f"0{num}"
        
        html.append(f'      <!-- Lesson {num} -->\n')
        html.append(f'      <article class="lesson-card" data-section="{lang}-{num}" id="{lang}-lesson-{num}">\n')
        html.append(f'        <div class="lesson-header" onclick="toggleSection(this)">\n')
        html.append(f'          <div class="lesson-title-area">\n')
        html.append(f'            <span class="lesson-number">{num_str}</span>\n')
        html.append(f'            <h3>{l["title"]}</h3>\n')
        html.append(f'          </div>\n')
        html.append(f'          <div class="lesson-controls">\n')
        html.append(f'            <button class="complete-btn" onclick="event.stopPropagation(); toggleComplete(\'{lang}-{num}\')" title="完了にする">\n')
        html.append(f'              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n')
        html.append(f'                <path d="M20 6L9 17l-5-5"/>\n')
        html.append(f'              </svg>\n')
        html.append(f'            </button>\n')
        html.append(f'            <span class="chevron">▼</span>\n')
        html.append(f'          </div>\n')
        html.append(f'        </div>\n')
        html.append(f'        <div class="lesson-body">\n')
        html.append(f'          <div class="concept-box">\n')
        html.append(f'            <h4>💡 {l["summary"]}</h4>\n')
        html.append(f'          </div>\n')
        
        for sec in l["sections"]:
            html.append(f'          <div class="explanation-box">\n')
            html.append(f'            <h4>{sec["heading"]}</h4>\n')
            html.append(f'            <p>{sec["body"]}</p>\n')
            html.append(f'          </div>\n')
            code = sec.get("code", "")
            if code:
                html.append(f'          <div class="code-block">\n')
                html.append(f'            <div class="code-header">\n')
                html.append(f'              <span class="code-lang">{lang.upper()}</span>\n')
                html.append(f'              <button class="copy-btn" onclick="copyCode(this)">📋 コピー</button>\n')
                html.append(f'            </div>\n')
                html.append(f'            <pre><code>{code}</code></pre>\n')
                html.append(f'          </div>\n')
                
    return "".join(html)

with open('python_ext.html', 'w', encoding='utf-8') as f:
    f.write(generate_html('python', python_lessons))

print("Created python HTML")
