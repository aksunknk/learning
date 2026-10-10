import json

python_quizzes = [
    {
        "question": "Pythonのデコレータ（@app.get など）の主な役割は何ですか？",
        "options": ["関数の中身を自動で暗号化する", "関数を呼び出す前後に、既存のコードを変えずに別の処理を追加する", "関数の実行速度を2倍にする", "エラーを完全に握りつぶす"],
        "correct": 1,
        "explanation": "デコレータは、既存の関数に後から機能（ログ出力や権限チェックなど）を「トッピング」するための仕組みです。"
    },
    {
        "question": "yield キーワードを使った「ジェネレータ」の最大のメリットは？",
        "options": ["コードが1行で書ける", "メモリを大量に消費して高速化する", "必要な分だけデータを生成するため、メモリを節約できる", "自動的にバックアップを取る"],
        "correct": 2,
        "explanation": "何万行もあるファイルを読む際など、一度にすべてリストに入れるとメモリがパンクしますが、yield を使えば1行ずつ処理できて安全です。"
    }
]

react_quizzes = [
    {
        "question": "Reactでカスタムフックを作る際のルールとして正しいものは？",
        "options": ["関数名を必ず 'use' から始める", "必ず 'function' キーワードを使わないといけない", "中で useEffect を使ってはいけない", "ファイル名を必ず大文字から始める"],
        "correct": 0,
        "explanation": "Reactのルールとして、フックは必ず「use」から始まる名前にする必要があります（useFetchなど）。これによりReactがフックとして認識します。"
    },
    {
        "question": "重い計算処理の結果をキャッシュして、不要な再計算を防ぐReactのフックは？",
        "options": ["useContext", "useMemo", "useReducer", "useRef"],
        "correct": 1,
        "explanation": "useMemoは「計算結果（値）」をメモ化（キャッシュ）します。関数の再生成を防ぐには useCallback を使います。"
    }
]

ts_quizzes = [
    {
        "question": "TypeScriptの Utility Types のうち、型 T のすべてのプロパティを「任意（省略可能）」にするのはどれ？",
        "options": ["Omit<T>", "Pick<T>", "Partial<T>", "Record<T>"],
        "correct": 2,
        "explanation": "Partial（パーシャル）を使うと、指定した型のすべてのプロパティに ? がつき、部分的な更新APIなどに便利です。"
    },
    {
        "question": "「obj is Bird」のように、戻り値の型として記述し、TypeScriptに型を教え込む仕組みを何と呼ぶ？",
        "options": ["Type Casting", "Type Assertion", "Type Guard（ユーザー定義型ガード）", "Type Inference"],
        "correct": 2,
        "explanation": "ユーザー定義型ガードを使うと、実行時のバリデーション結果をもとに、コンパイル時にも安全な型付けを強制できます。"
    }
]

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/app.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

py_q_str = ",\n".join([json.dumps(q, ensure_ascii=False) for q in python_quizzes])
re_q_str = ",\n".join([json.dumps(q, ensure_ascii=False) for q in react_quizzes])
ts_q_str = ",\n".join([json.dumps(q, ensure_ascii=False) for q in ts_quizzes])

js_content = js_content.replace('    }\n  ],\n  react: [', '    },\n' + py_q_str + '\n  ],\n  react: [')
js_content = js_content.replace('    }\n  ],\n  typescript: [', '    },\n' + re_q_str + '\n  ],\n  typescript: [')
js_content = js_content.replace('    }\n  ],\n  webapi: [', '    },\n' + ts_q_str + '\n  ],\n  webapi: [')

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/app.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Updated app.js with advanced quizzes")
