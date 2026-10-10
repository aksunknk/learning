import json

python_quizzes = [
    {
        "question": "Pythonの辞書（dict）から安全に値を取得するメソッドはどれですか？",
        "options": ["fetch()", "get()", "pull()", "extract()"],
        "correct": 1,
        "explanation": "get() メソッドを使うと、キーが存在しない場合でもエラーでプログラムが止まらず、None または指定したデフォルト値を返します。"
    },
    {
        "question": "例外処理（エラー対策）で、エラーが起きても処理を継続させるためのキーワードは？",
        "options": ["try - catch", "try - except", "attempt - fail", "do - catch"],
        "correct": 1,
        "explanation": "Pythonでは try と except を使って例外処理を書きます。JSなどの try-catch とはキーワードが異なります。"
    },
    {
        "question": "リストの要素をループ処理で削除する際の問題を防ぐ最も一般的な方法は？",
        "options": ["新しいリストを作成する（リスト内包表記など）", "remove()を複数回呼ぶ", "del文を使う", "ループのインデックスを-1ずつ減らす"],
        "correct": 0,
        "explanation": "ループ中にリスト自身を変更（破壊的変更）するとインデックスがずれ、バグの原因になります。新しいリストを生成するのが安全です。"
    },
    {
        "question": "FastAPIでAPIの期待するデータ構造（型）を定義するために使われるライブラリは？",
        "options": ["SQLAlchemy", "Requests", "Pydantic", "Jinja2"],
        "correct": 2,
        "explanation": "Pydantic の BaseModel を継承したクラスを定義することで、FastAPIは自動的にデータのバリデーションと型変換を行います。"
    }
]

react_quizzes = [
    {
        "question": "useEffectの第二引数（依存配列）を空の配列 [] にするとどうなりますか？",
        "options": ["毎回レンダリング時に実行される", "一度も実行されない", "初回マウント時のみ実行される", "エラーになる"],
        "correct": 2,
        "explanation": "空の配列を渡すと「依存する値がない＝変化する値がない」とみなされ、最初の1回しか実行されません。API取得によく使われます。"
    },
    {
        "question": "深い階層のコンポーネントへPropsをバケツリレーせずにデータを渡すReactの機能は？",
        "options": ["Context API", "Redux", "React Router", "React Query"],
        "correct": 0,
        "explanation": "Context API（createContext / useContext）を使うと、中間のコンポーネントを飛ばして直接データを参照できます。"
    },
    {
        "question": "Reactで無限レンダリングを引き起こす最もよくある原因は？",
        "options": ["不要なdivタグを使う", "レンダリング中に状態（State）を更新してしまう", "classNameを間違える", "アロー関数を使わない"],
        "correct": 1,
        "explanation": "コンポーネントの本体で setState などを直接呼ぶと、状態が更新される→再レンダリングされる→またsetStateが呼ばれる、というループに陥ります。"
    },
    {
        "question": "Reactの状態（State）として配列を更新する際の正しい書き方は？",
        "options": ["array.push(newItem)", "array.append(newItem)", "setArray([...array, newItem])", "setArray(array.push(newItem))"],
        "correct": 2,
        "explanation": "Reactは「新しい配列/オブジェクトになったか」で変更を検知します。スプレッド構文（...）を使って新しい配列を作る必要があります。"
    }
]

ts_quizzes = [
    {
        "question": "関数を利用する側で後から型を決定できるTypeScriptの機能は？",
        "options": ["Any", "Generics（ジェネリクス）", "Interface", "Type Alias"],
        "correct": 1,
        "explanation": "ジェネリクス（<T> など）を使うと、関数の再利用性が高まり、かつ実行時に型安全性が保たれます。"
    },
    {
        "question": "「文字列か数値のどちらか」を表す型定義（Union型）はどれですか？",
        "options": ["string & number", "string | number", "string || number", "string, number"],
        "correct": 1,
        "explanation": "Union型は |（パイプ）を使って定義します。複数の型のうちどれか一つであることを示します。"
    },
    {
        "question": "TypeScriptで値が null や undefined かもしれない場合に安全にプロパティにアクセスする記号は？",
        "options": ["!!", "??", "?.", "!"],
        "correct": 2,
        "explanation": "オプショナルチェーン（?.）を使うと、値が null/undefined の場合でもエラーにならず undefined を返して安全に処理を続けます。"
    },
    {
        "question": "TypeScriptで any 型を避けるべき最大の理由は？",
        "options": ["コンパイルが遅くなるから", "型チェックが完全に無効になりバグに気づけなくなるから", "コードが長くなるから", "他の言語と互換性がなくなるから"],
        "correct": 1,
        "explanation": "anyを使うとTypeScriptの最大のメリットである「事前エラー検知」が働かなくなり、単なるJavaScriptと同じになってしまいます。"
    }
]

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/app.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

def insert_quizzes(lang, new_quizzes, js_code):
    # Find the end of the language array
    import re
    # We want to find the array of the given language inside quizData
    # e.g., react: [ ... ],
    # We will just do a string replacement. 
    # It's easier to find the end of the array by searching for the start of the next language.
    # But webapi is the last one.
    
    # Let's use regex to find the language array and append to it.
    
    pass

import json
py_q_str = ",\n".join([json.dumps(q, ensure_ascii=False) for q in python_quizzes])
re_q_str = ",\n".join([json.dumps(q, ensure_ascii=False) for q in react_quizzes])
ts_q_str = ",\n".join([json.dumps(q, ensure_ascii=False) for q in ts_quizzes])

# Manual insertion
# Replace   ],\n  react: [ with   ],\n  react: [ but insert py_q_str before   ],\n  react: [
js_content = js_content.replace('    }\n  ],\n  react: [', '    },\n' + py_q_str + '\n  ],\n  react: [')
js_content = js_content.replace('    }\n  ],\n  typescript: [', '    },\n' + re_q_str + '\n  ],\n  typescript: [')
js_content = js_content.replace('    }\n  ],\n  webapi: [', '    },\n' + ts_q_str + '\n  ],\n  webapi: [')

with open('C:/Users/aksak/Documents/antigravity/eager-tesla/app.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Updated app.js with new quizzes")
