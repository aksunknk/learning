react_lessons = [
    {
        "id": 6,
        "title": "副作用の統制（useEffectと依存配列の正しい使い方）",
        "summary": "APIデータの取得やDOMの直接操作など、Reactの描画以外の処理",
        "sections": [
            {
                "heading": "useEffectの基本",
                "body": "Reactではコンポーネントが画面に表示された後や、特定の値が変わった時に処理を走らせるために useEffect を使います。データのfetch処理によく使われます。",
                "code": "import { useEffect, useState } from 'react';\n\nfunction App() {\n  const [data, setData] = useState([]);\n\n  useEffect(() => {\n    // 初回マウント時に一度だけ実行される\n    fetch('/api/tasks')\n      .then(res => res.json())\n      .then(data => setData(data));\n  }, []); // 依存配列が空なので一度だけ実行\n\n  return <div>{data.length} tasks</div>;\n}"
            }
        ]
    },
    {
        "id": 7,
        "title": "状態のバケツリレー回避（PropsとContext）",
        "summary": "コンポーネントが深くなるとPropsを渡すのが辛くなる",
        "sections": [
            {
                "heading": "Prop Drilling（バケツリレー）とは？",
                "body": "親から子、子から孫へとPropsを渡し続けると、中間のコンポーネントが不要なデータを持ち回ることになります。これを解決するために Context API や Zustand などの状態管理ライブラリが使われます。",
                "code": "// Contextの例\nimport { createContext, useContext } from 'react';\n\nconst UserContext = createContext(null);\n\nfunction App() {\n  return (\n    <UserContext.Provider value={{ name: 'Alice' }}>\n      <DeepComponent />\n    </UserContext.Provider>\n  );\n}\n\nfunction DeepComponent() {\n  // 途中のProps渡しなしで直接値を取得\n  const user = useContext(UserContext);\n  return <div>{user.name}</div>;\n}"
            }
        ]
    },
    {
        "id": 8,
        "title": "よくあるエラーとアンチパターン",
        "summary": "Reactで初学者が必ず踏む罠",
        "sections": [
            {
                "heading": "無限レンダリング",
                "body": "useEffectの依存配列を書き忘れたり、レンダリング中に直接状態を更新したりすると、コンポーネントが無限に再描画されてブラウザがフリーズします。",
                "code": "// ❌ 無限ループの罠\nfunction BadCounter() {\n  const [count, setCount] = useState(0);\n  \n  // レンダリングされるたびに呼ばれ、さらにレンダリングを引き起こす\n  // setCount(count + 1);\n  \n  return <div>{count}</div>;\n}"
            },
            {
                "heading": "Stateの直接変更",
                "body": "Reactは「オブジェクトの参照が変わったか」で再描画を判定します。配列にpushしても参照は変わらないため、画面が更新されません。",
                "code": "// ❌ Stateの直接変更（画面が更新されない）\n// list.push('new item');\n// setList(list);\n\n// ✅ スプレッド構文で新しい配列を作る\nsetList([...list, 'new item']);"
            }
        ]
    },
    {
        "id": 9,
        "title": "Final Mission: フルスタックTodoアプリ構築・フロントエンド編",
        "summary": "useStateを使った状態管理でTodoリストのUIを作る",
        "sections": [
            {
                "heading": "Todoアプリの実装",
                "body": "タスクの追加、完了の切り替え、削除をReactで実装します。以下のコードは機能の基礎です。実際に下のデモ画面で触ってみましょう！",
                "code": "function TodoApp() {\n  const [tasks, setTasks] = useState([]);\n  const [text, setText] = useState('');\n\n  const addTask = () => {\n    if(!text) return;\n    setTasks([...tasks, { id: Date.now(), text, done: false }]);\n    setText('');\n  };\n\n  return (\n    <div>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <button onClick={addTask}>追加</button>\n      <ul>\n        {tasks.map(t => (\n          <li key={t.id}>{t.text}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}"
            }
        ]
    }
]

ts_lessons = [
    {
        "id": 6,
        "title": "型の柔軟性（ジェネリクス/Generics）",
        "summary": "どんな型でも受け入れつつ、型安全を保つ魔法",
        "sections": [
            {
                "heading": "ジェネリクスとは？",
                "body": "関数やクラスを作るときに「後から型を決める」仕組みです。配列の定義によく見る Array<string> もジェネリクスの一種です。",
                "code": "// 型引数Tを受け取る関数\nfunction getFirstItem<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\n// 使うときに型が決まる\nconst num = getFirstItem<number>([1, 2, 3]); // num は number 型\nconst str = getFirstItem<string>(['a', 'b']); // str は string 型"
            }
        ]
    },
    {
        "id": 7,
        "title": "型の合成と防衛（Union型、Intersection型、Interface）",
        "summary": "複雑なデータを正確に表現する",
        "sections": [
            {
                "heading": "Union（ユニオン）とIntersection（インターセクション）",
                "body": "Union型は「A または B」、Intersection型は「A かつ B」を表します。実務ではAPIのステータス表現などで非常に多く使われます。",
                "code": "// Union型（パイプライン記号）\ntype Status = 'loading' | 'success' | 'error';\nlet currentStatus: Status = 'loading';\n\n// Intersection型（アンパサンド記号）\ntype User = { id: number; name: string };\ntype Admin = { privileges: string[] };\n\ntype AdminUser = User & Admin; // 両方のプロパティを持つ"
            }
        ]
    },
    {
        "id": 8,
        "title": "よくあるエラーとアンチパターン",
        "summary": "TypeScriptを使う意味をなくしてしまう書き方",
        "sections": [
            {
                "heading": "any型への逃避",
                "body": "型エラーが解決できないとき、とりあえず any を使ってしまうのは最悪のアンチパターンです。型チェックが完全に無効になり、バグの温床になります。",
                "code": "// ❌ anyの濫用\nfunction processData(data: any) {\n  return data.toUpperCase(); // 実行時にdataが数値ならクラッシュする\n}\n\n// ✅ unknown型を使って安全にチェックする\nfunction safeProcess(data: unknown) {\n  if (typeof data === 'string') {\n    return data.toUpperCase();\n  }\n}"
            },
            {
                "heading": "Object is possibly null",
                "body": "APIのレスポンスやDOMの取得など、「値が存在しないかもしれない（null/undefined）」ケースでそのままプロパティにアクセスしようとすると怒られます。",
                "code": "// ❌ エラーになる\n// const el = document.getElementById('my-btn');\n// el.click(); // Object is possibly 'null'\n\n// ✅ オプショナルチェーン（?.）を使う\ndocument.getElementById('my-btn')?.click();"
            }
        ]
    },
    {
        "id": 9,
        "title": "Final Mission: Todoアプリ構築（結合・API通信編）",
        "summary": "フロントとバックエンドを型で繋ぐ",
        "sections": [
            {
                "heading": "InterfaceによるAPIスキーマの定義",
                "body": "FastAPIのPydanticモデル（Task）と全く同じ構造をTypeScriptのInterfaceで定義することで、通信データを安全に扱えます。",
                "code": "interface Task {\n  id: number;\n  title: string;\n  completed: boolean;\n}\n\n// fetch通信にも型をつける\nasync function fetchTasks(): Promise<Task[]> {\n  const response = await fetch('http://localhost:8000/tasks');\n  if (!response.ok) {\n    throw new Error('Network response was not ok');\n  }\n  return await response.json();\n}"
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
                
        if lang == 'react' and num == 9:
            demo_html = """
          <div class="demo-box" style="margin-top: 2rem; padding: 1.5rem; background: var(--color-surface-raised); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <h4 style="margin-top:0; color: var(--react-cyan); display: flex; align-items: center; gap: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              Todoアプリ モックアップ体験
            </h4>
            <p style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
              Reactで作るTodoアプリのUIを実際に触ってみましょう。これはフロントエンド（HTML/JS）だけで動作するデモです。
            </p>
            <div id="todo-mockup-app" style="background: var(--color-base); padding: 1rem; border-radius: var(--radius-sm);">
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <input type="text" id="todo-input" placeholder="新しいタスクを入力..." style="flex: 1; padding: 0.75rem; border-radius: 4px; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-primary);">
                <button onclick="addTodoMockup()" style="background: var(--react-cyan); color: #000; font-weight: bold; padding: 0 1rem; border-radius: 4px; border: none; cursor: pointer;">追加</button>
              </div>
              <ul id="todo-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                <li style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--color-surface); border-radius: 4px; border: 1px solid var(--color-border);">
                  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" checked onchange="toggleTodoMockup(this)">
                    <span style="text-decoration: line-through; opacity: 0.5;">Reactの基礎を学ぶ</span>
                  </label>
                  <button onclick="deleteTodoMockup(this)" style="background: transparent; color: var(--color-error); border: none; cursor: pointer;">削除</button>
                </li>
                <li style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--color-surface); border-radius: 4px; border: 1px solid var(--color-border);">
                  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" onchange="toggleTodoMockup(this)">
                    <span>FastAPIと通信する</span>
                  </label>
                  <button onclick="deleteTodoMockup(this)" style="background: transparent; color: var(--color-error); border: none; cursor: pointer;">削除</button>
                </li>
              </ul>
            </div>
            
            <script>
              function addTodoMockup() {
                const input = document.getElementById('todo-input');
                const text = input.value.trim();
                if (!text) return;
                
                const ul = document.getElementById('todo-list');
                const li = document.createElement('li');
                li.style.cssText = 'display: flex; justify-content: space-between; padding: 0.75rem; background: var(--color-surface); border-radius: 4px; border: 1px solid var(--color-border);';
                li.innerHTML = '<label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">' +
                  '<input type="checkbox" onchange="toggleTodoMockup(this)">' +
                  '<span>' + text + '</span>' +
                  '</label>' +
                  '<button onclick="deleteTodoMockup(this)" style="background: transparent; color: var(--color-error); border: none; cursor: pointer;">削除</button>';
                ul.appendChild(li);
                input.value = '';
              }
              function deleteTodoMockup(btn) {
                btn.closest('li').remove();
              }
              function toggleTodoMockup(checkbox) {
                const span = checkbox.nextElementSibling;
                if (checkbox.checked) {
                  span.style.textDecoration = 'line-through';
                  span.style.opacity = '0.5';
                } else {
                  span.style.textDecoration = 'none';
                  span.style.opacity = '1';
                }
              }
              document.addEventListener('DOMContentLoaded', () => {
                  setTimeout(() => {
                    const input = document.getElementById('todo-input');
                    if(input) {
                        input.addEventListener('keypress', function (e) {
                          if (e.key === 'Enter') addTodoMockup();
                        });
                    }
                  }, 1000);
              });
            </script>
          </div>
"""
            html.append(demo_html)
                
        html.append(f'        </div>\n')
        html.append(f'      </article>\n\n')
    return "".join(html)

with open('react_ext.html', 'w', encoding='utf-8') as f:
    f.write(generate_html('react', react_lessons))

with open('ts_ext.html', 'w', encoding='utf-8') as f:
    f.write(generate_html('typescript', ts_lessons))

print("Created react and ts HTML")
