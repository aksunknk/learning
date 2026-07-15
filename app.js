// ============================================================
// app.js — Code Foundations 学習サイト
// 対象: AIでアプリを作った経験はあるが、コードをあまり書いたことがない初級者
// ============================================================

"use strict";

// --------------------------------------------------
// 1. クイズデータ
// --------------------------------------------------
const quizData = {

  "docker": [
    {"question": "コンテナと仮想マシン(VM)の最大の違いは何ですか？", "options": ["コンテナはハードウェアをエミュレートする", "コンテナはホストOSのカーネルを共有する", "VMはカーネルを共有する", "コンテナは数GBのメモリを必ず消費する"], "correct": 1, "explanation": "コンテナはホストOSのカーネルを共有することで、ゲストOSを起動するVMよりも圧倒的に高速かつ軽量に動作します。"},
    {"question": "Dockerfileにおいて、イメージのベースとなるOSや環境を指定する命令は？", "options": ["RUN", "CMD", "COPY", "FROM"], "correct": 3, "explanation": "FROM命令はDockerfileの最初に記述され、ベースとなるイメージ（例：FROM python:3.12-slim）を指定します。"},
    {"question": "docker-compose.yml の depends_on が保証する状態はどれですか？", "options": ["依存コンテナが起動したこと", "依存コンテナ内のアプリが準備完了したこと", "依存コンテナが正常終了したこと", "依存コンテナのデータが永続化されたこと"], "correct": 0, "explanation": "デフォルトのdepends_onは「起動順序」のみを制御します。アプリの準備完了まで待つには condition: service_healthy と healthcheck を組み合わせる必要があります。"},
    {"question": "コンテナ内で生成されたデータをコンテナ削除後も残すための仕組みはどれですか？", "options": ["レイヤーキャッシュ", "マルチステージビルド", "ボリューム", "namespaces"], "correct": 2, "explanation": "ボリューム（Volume）やバインドマウントを使用することで、ホスト側の領域にデータを保存し、コンテナが削除されてもデータを永続化できます。"}
  ],
  "database": [
    {"question": "CSVファイルと比較して、RDBMS(リレーショナルデータベース)の優れた点は何ですか？", "options": ["テキストエディタで直接開いて編集できる", "複数のプログラムから同時に安全に更新できる", "OSを選ばずダブルクリックで実行できる", "データ型の制約が一切ない"], "correct": 1, "explanation": "RDBMSはトランザクション管理により、複数人が同時にアクセス・更新してもデータが壊れたり矛盾したりしないよう制御する機能に優れています。"},
    {"question": "全ての行や列を取得する「SELECT *」を本番環境で避けるべき主な理由は何ですか？", "options": ["SQL文が長くなってしまうため", "常にエラーが発生するため", "不要なデータまで取得しネットワーク帯域やメモリを無駄に消費するため", "データが自動的に削除されるため"], "correct": 2, "explanation": "必要な列だけを SELECT id, name のように指定することで、転送量やメモリ使用量を抑え、パフォーマンスを最適化できます。"},
    {"question": "UPDATE文やDELETE文を実行する際、最も注意すべきことは何ですか？", "options": ["ORDER BY句を必ず付ける", "WHERE句で条件を指定し忘れないこと", "全て大文字で記述すること", "GROUP BY句を含めること"], "correct": 1, "explanation": "WHERE句を忘れると、テーブル内の全ての行に対して更新や削除が行われてしまうため、致命的な事故につながります。"},
    {"question": "SQLの実行計画（インデックスが使われているか等）を確認するコマンドは？", "options": ["CHECK", "EXPLAIN", "SHOW", "DESCRIBE"], "correct": 1, "explanation": "EXPLAIN（または EXPLAIN ANALYZE）を使用すると、データベースがそのクエリをどのように実行するか（全表スキャンか、インデックススキャンか等）を確認できます。"}
  ],
  
  
  "testing": [
    {"question": "テストピラミッドにおいて、最も多く書くべきテストの種類はどれですか？", "options": ["E2Eテスト", "結合テスト", "ユニットテスト", "受入テスト"], "correct": 2, "explanation": "テストピラミッドでは、高速で安価なユニットテストを最も多く書き（約70%）、結合テスト（〜20%）、E2Eテスト（〜10%）の順に少なくするのが推奨されます。"},
    {"question": "同値分割法で年齢入力（0〜120歳が有効）をテストする場合、最低限必要な同値クラスの数は？", "options": ["2つ（有効・無効）", "3つ（無効/有効/無効）", "4つ以上", "1つ（有効のみ）"], "correct": 1, "explanation": "最低限、「0未満（無効）」「0〜120（有効）」「121以上（無効）」の3つの同値クラスに分割する必要があります。"},
    {"question": "境界値分析の主な目的はどれですか？", "options": ["全ての入力値をテストすること", "境界付近に集中するオフバイワンエラーを検出すること", "テストケースの数を最大化すること", "内部構造を把握すること"], "correct": 1, "explanation": "バグの多くは範囲の境界付近（<= と < の取り違えなど）で発生します。境界値分析は境界の値とその直前・直後の値を重点的にテストする技法です。"},
    {"question": "C1カバレッジ（分岐網羅）とC0カバレッジ（命令網羅）の違いは何ですか？", "options": ["C1の方が基準が緩い", "C1はif文のTrue/False両方の分岐を通過する必要がある", "C0はC1よりも厳格である", "C1とC0に違いはない"], "correct": 1, "explanation": "C0は全ての命令文を1回実行すればOKですが、C1は全ての分岐（if文のTrue分岐とFalse分岐の両方）を通す必要があり、より厳格です。"},
    {"question": "ペアワイズ法（All-Pairs法）の根拠となる経験則は何ですか？", "options": ["バグの100%は1つのパラメータで発生する", "バグの約70%は2つのパラメータの組み合わせで発生する", "3つ以上のパラメータのバグは存在しない", "テストケースは常に半分に削減できる"], "correct": 1, "explanation": "NSTの調査では、ソフトウェアの欠陥の約67%は2因子の相互作用で発生するとされています。ペアワイズ法はこの経験則に基づき、任意の2因子の全ペアを網羅する最小テストセットを求めます。"},
    {"question": "TDD（テスト駆動開発）の正しいサイクル順序はどれですか？", "options": ["Green → Red → Refactor", "Refactor → Red → Green", "Red → Green → Refactor", "Red → Refactor → Green"], "correct": 2, "explanation": "TDDは「Red（失敗するテストを書く）→ Green（テストを通す最小限の実装）→ Refactor（コードを改善）」のサイクルを繰り返します。"},
    {"question": "unittest.mock の @patch で指定するパスとして正しいのはどれですか？", "options": ["テスト対象の関数が定義されているモジュールのパス", "テスト対象の関数がインポートされているモジュールのパス", "テストファイル自体のパス", "Python標準ライブラリのパス"], "correct": 1, "explanation": "@patch のパスは「テスト対象がインポートしている場所」を指定します。例えばmyapp.serviceでfrom requests import getしている場合、@patch('myapp.service.get')と書きます。"},
    {"question": "E2Eテストで CSSクラス名の代わりに使うべきセレクタは何ですか？", "options": ["id属性", "XPath", "data-testid属性", "タグ名"], "correct": 2, "explanation": "data-testid属性はテスト専用に設計された属性で、UI デザインの変更（CSSクラスの変更）に影響されません。E2Eテストの安定性を大幅に向上させます。"}
  ],
  "python-prac": [
    {"question": "リスト内包表記で if-else（三項演算子）を使う場合、正しい構文はどれですか？", "options": ["[x if x > 0 for x in data else -x]", "[x if x > 0 else -x for x in data]", "[for x in data if x > 0 else -x]", "[x for x in data if x > 0 else -x]"], "correct": 1, "explanation": "三項演算子（if-else）は for の前に配置します。[値A if 条件 else 値B for x in iterable] が正しい構文です。"},
    {"question": "ジェネレータ関数の特徴として正しいものはどれですか？", "options": ["return文で値を返す", "呼び出し時にすべての値をメモリに格納する", "yield文で値を一つずつ返し、状態を保持する", "リストよりも多くのメモリを消費する"], "correct": 2, "explanation": "ジェネレータはyieldで値を一つずつ返し、次にnext()が呼ばれるまで実行を一時停止します。これにより大量データの処理でもメモリ消費を抑えられます。"},
    {"question": "デコレータで @functools.wraps(func) を使う主な理由は何ですか？", "options": ["デコレータの実行速度を向上させるため", "元の関数の __name__ や __doc__ を保持するため", "デコレータを複数重ねられるようにするため", "引数の型チェックを自動で行うため"], "correct": 1, "explanation": "@functools.wraps(func)を使わないと、デコレートされた関数の__name__がwrapperに、__doc__がNoneになり、デバッグやドキュメント生成に支障をきたします。"},
    {"question": "collections.Counter同士で引き算をした場合、負の値を持つ要素はどうなりますか？", "options": ["そのまま負の値として残る", "0として残る", "自動的に除外される", "ValueErrorが発生する"], "correct": 2, "explanation": "Counter同士の減算では、結果が0以下になる要素は自動的に結果から除外されます。例: Counter(a=3) - Counter(a=5) は Counter() になります。"},
    {"question": "re.match() と re.search() の違いとして正しい説明はどれですか？", "options": ["matchは最初のマッチ、searchは全てのマッチを返す", "matchは文字列の先頭からのみマッチし、searchは文字列全体を走査する", "matchは大文字小文字を区別しないが、searchは区別する", "matchはコンパイル済みパターンのみ使える"], "correct": 1, "explanation": "re.match()は文字列の先頭からマッチを試みます。re.search()は文字列全体を走査して最初のマッチを探します。"},
    {"question": "loggingモジュールのデフォルトのログレベルはどれですか？", "options": ["DEBUG", "INFO", "WARNING", "ERROR"], "correct": 2, "explanation": "デフォルトのログレベルはWARNINGです。そのため、logging.debug()やlogging.info()の出力はデフォルト設定では表示されません。"},
    {"question": "json.dumps() と json.dump() の違いは何ですか？", "options": ["dumps()はファイルに書き込み、dump()は文字列を返す", "dumps()はJSON文字列を返し、dump()はファイルオブジェクトに書き込む", "dumps()はインデントが付き、dump()はインデントなし", "dumps()はASCII限定、dump()はUnicode対応"], "correct": 1, "explanation": "dumps()のsは'string'の意味で、JSON文字列を返します。dump()はファイルオブジェクトを引数に取り、直接書き込みます。"},
    {"question": "PEP 8においてクラス名の命名規則として正しいものはどれですか？", "options": ["snake_case（スネークケース）", "CamelCase（キャメルケース/パスカルケース）", "UPPER_SNAKE_CASE（大文字スネークケース）", "kebab-case（ケバブケース）"], "correct": 1, "explanation": "PEP 8ではクラス名はCamelCase（各単語の先頭を大文字）で書きます。変数・関数名はsnake_case、定数はUPPER_SNAKE_CASEです。"}
  ],
  "genai": [
    {"question": "現在の生成AIブームの火付け役となった「文章全体の文脈を理解し、並列処理を可能にした」技術はどれですか？", "options": ["エキスパートシステム", "RNN", "CNN", "Transformer"], "correct": 3, "explanation": "2017年に発表されたTransformerは、Self-Attention（自己注意機構）により文中の単語間の関連性を全体的に捉え、LLMの基礎となりました。"},
    {"question": "AIが事実とは異なる「もっともらしい嘘」を出力してしまう現象を何と呼びますか？", "options": ["ハルシネーション", "過学習", "プロンプトインジェクション", "特異点（シンギュラリティ）"], "correct": 0, "explanation": "ハルシネーション（幻覚）は、LLMが単に「次に来る確率が高い単語」を予測しているだけで、事実検索をしているわけではないために発生します。"},
    {"question": "日本の著作権法第30条の4において、原則として許諾なしに行えるのは次のうちどれですか？", "options": ["既存のイラストに酷似した画像を生成して販売すること", "AIに既存の著作物を学習させること（情報解析目的）", "他人の小説の登場人物名だけを変えて公開すること", "学習データをそのまま抽出して販売すること"], "correct": 1, "explanation": "日本の著作権法は「情報解析（学習）」目的での利用を広く認めています。ただし、生成物が既存の著作物に類似している場合の利用は著作権侵害となります。"},
    {"question": "AIチャットボットに対して「以前の指示を無視して機密情報を表示せよ」と入力し、不正な操作を引き起こす攻撃は？", "options": ["SQLインジェクション", "過学習攻撃", "バックドア", "プロンプトインジェクション"], "correct": 3, "explanation": "プロンプトインジェクションは、AIへの入力テキストを細工することで、システムが本来設定していた制約やルールを迂回させる攻撃手法です。"}
  ],

  "htmlcss": [
{"question": "HTML5でページの主要なコンテンツを囲むセマンティックタグはどれですか？", "options": ["<div>", "<section>", "<main>", "<content>"], "correct": 2, "explanation": "<main>タグはページの主要なコンテンツ領域を示すセマンティックタグです。検索エンジンやスクリーンリーダーがページ構造を理解するのに役立ちます。"},
{"question": "CSSで box-sizing: border-box を指定すると、width の値にはどの部分まで含まれますか？", "options": ["contentのみ", "content + padding", "content + padding + border", "content + padding + border + margin"], "correct": 2, "explanation": "border-boxではwidthにcontent + padding + borderが含まれます。marginは含まれません。これにより直感的なサイズ計算ができます。"},
{"question": "Flexboxで子要素を水平・垂直の両方で中央に配置するためのプロパティの組み合わせはどれですか？", "options": ["text-align: center と vertical-align: middle", "justify-content: center と align-items: center", "margin: 0 auto と padding: auto", "position: absolute と transform: translate(-50%, -50%)"], "correct": 1, "explanation": "Flexboxの親要素にjustify-content: center（水平中央）とalign-items: center（垂直中央）を指定するのが最もシンプルな中央配置の方法です。"},
{"question": "CSSアニメーションでパフォーマンスに最も優れたプロパティはどれですか？", "options": ["width と height", "margin と padding", "transform と opacity", "top と left"], "correct": 2, "explanation": "transformとopacityはGPU（グラフィックカード）で処理されるため、レイアウトの再計算が不要で60fpsのスムーズなアニメーションが実現できます。"},
{"question": "レスポンシブデザインで clamp(1.5rem, 4vw, 3rem) と書いた場合の意味はどれですか？", "options": ["常に4vwのサイズを使う", "1.5remから3remの間で4vwに基づいてサイズが変わる", "最小3rem、最大1.5rem", "ビューポート幅の4%を固定値として使う"], "correct": 1, "explanation": "clamp(最小値, 推奨値, 最大値)は、推奨値を使いつつ最小値と最大値の範囲にクランプ（制限）します。画面サイズに応じて流動的にフォントサイズが変化します。"},
{"question": "imgタグにwidthとheightを指定する主な理由はどれですか？", "options": ["画像のファイルサイズを小さくするため", "CLS（レイアウトシフト）を防止するため", "画像の解像度を上げるため", "レスポンシブデザインのため"], "correct": 1, "explanation": "width/heightを指定することで、画像読み込み前にブラウザがスペースを確保でき、読み込み後のレイアウトのガタつき（CLS）を防止できます。Core Web Vitalsの重要指標です。"},
{"question": "CSS Gridで repeat(auto-fit, minmax(280px, 1fr)) を使うと何が実現できますか？", "options": ["固定3列のグリッド", "メディアクエリなしのレスポンシブグリッド", "アニメーション付きのグリッド", "グリッドアイテムの重なり"], "correct": 1, "explanation": "auto-fitとminmax()の組み合わせにより、画面幅に応じて自動的に列数が増減するレスポンシブグリッドがメディアクエリなしで実現できます。"},
{"question": "target='_blank'でリンクを開くとき、セキュリティ上追加すべき属性はどれですか？", "options": ["rel='nofollow'", "rel='noopener noreferrer'", "aria-label='external'", "data-external='true'"], "correct": 1, "explanation": "rel='noopener noreferrer'を付けないと、開いた先のページからwindow.openerを通じて元のページを操作される可能性があります（タブナビング攻撃）。"}
  ],
  "python-cert": [
{"question": "Pythonの文字列に対するスライス操作 `s = 'Python'` について、`s[1:4]` の結果として正しいものは？", "options": ["'Pyt'", "'yth'", "'ytho'", "'thon'"], "correct": 1, "explanation": "スライス `[start:stop]` は start番目のインデックスを含み、stop番目のインデックスを含みません。インデックス1は 'y'、インデックス4は 'o' なので 'yth' となります。"},
{"question": "リストに対する操作で、`a = [1, 2, 3]` に対して `b = a` とした後、`b[0] = 99` を実行しました。`print(a[0])` の結果は？", "options": ["1", "99", "エラーになる", "None"], "correct": 1, "explanation": "`b = a` はリストのコピーではなく「参照渡し」です。同じリストを指しているため、bを変更するとaも変更されます。別々のリストにするには `b = a[:]` などを使います。"},
{"question": "ループにおける `for...else` 構文の `else` ブロックが実行される条件はどれですか？", "options": ["ループ内でエラーが発生したとき", "ループが1回も実行されなかったとき", "ループが break文によって中断されたとき", "ループが break文によって中断されることなく最後まで完了したとき"], "correct": 3, "explanation": "for...else の else ブロックは、リストなどの要素をすべて処理し終えて（breakされずに）ループを抜けた場合にのみ実行されます。"},
{"question": "関数のデフォルト引数に関する以下のコードの出力として正しいものはどれですか？\\n`def f(a, L=[]): L.append(a); return L`\\n`print(f(1)); print(f(2))`", "options": ["[1]\\n[2]", "[1]\\n[1, 2]", "エラーになる", "None\\nNone"], "correct": 1, "explanation": "デフォルト引数は関数定義時に一度だけ評価されます。そのため、リストなどのミュータブルなオブジェクトを使うと、複数回の呼び出しで同じリストが共有されてしまいます。"},
{"question": "モジュールをインポートする際、Pythonがモジュールを探すパスのリストが格納されている変数はどれですか？", "options": ["os.path", "sys.modules", "sys.path", "env.PYTHONPATH"], "correct": 2, "explanation": "`sys.path` は、Pythonがモジュールを検索するディレクトリの文字列のリストです。"},
{"question": "例外処理において、`except` 節を複数書く際の正しい順序はどれですか？", "options": ["親クラス（BaseExceptionなど）から先に書く", "子クラス（FileNotFoundErrorなど）から先に書く", "順序は関係ない", "アルファベット順に書く"], "correct": 1, "explanation": "`except` 節は上から順に評価されるため、子クラスから先に書かないと、親クラスがすべてをキャッチしてしまい、意図した処理が行われません。"},
{"question": "クラス変数とインスタンス変数の違いについて、正しい説明はどれですか？", "options": ["クラス変数は各インスタンスが別々に保持するデータである", "インスタンス変数はすべてのインスタンスで共有されるデータである", "クラス変数はすべてのインスタンスで共有される", "クラス内ではインスタンス変数を定義できない"], "correct": 2, "explanation": "クラス変数はクラス全体で共有されるデータであり、インスタンス変数は `self.name` のようにインスタンスごとに固有のデータです。"},
{"question": "意図的に例外を発生させるために使用するキーワードはどれですか？", "options": ["throw", "raise", "catch", "except"], "correct": 1, "explanation": "Pythonで意図的に例外を投げる（発生させる）には `raise` キーワードを使います。"},
{"question": "標準ライブラリの `math` モジュールを使って円周率を取得する正しい方法は？", "options": ["math.pi", "math.PI", "math.pi()", "math.get_pi()"], "correct": 0, "explanation": "`math.pi` は数学定数 π を利用できる変数（属性）です。メソッドではありません。"}
  ],

  algorithm: [
    {
      question: "計算量 O(n log n) に該当するアルゴリズムはどれですか？",
      options: ["線形探索", "バブルソート", "マージソート", "二分探索"],
      correct: 2,
      explanation: "マージソートは分割統治法により常に O(n log n) の計算量を達成します。バブルソートは O(n²)、線形探索は O(n)、二分探索は O(log n) です。"
    },
    {
      question: "二分探索を使用するための前提条件は何ですか？",
      options: ["データが整数であること", "データがソート済みであること", "データの件数が偶数であること", "データに重複がないこと"],
      correct: 1,
      explanation: "二分探索は中央の要素と比較して探索範囲を半分に絞る手法のため、データが昇順または降順にソートされていることが絶対条件です。"
    },
    {
      question: "スタック（Stack）のデータ取り出し順序は？",
      options: ["FIFO（先入れ先出し）", "LIFO（後入れ先出し）", "ランダム", "優先度順"],
      correct: 1,
      explanation: "スタックは LIFO（Last In, First Out）方式です。最後に追加した要素が最初に取り出されます。FIFOはキュー（Queue）の特徴です。"
    },
    {
      question: "Pythonの辞書（dict）の検索・追加・削除の平均計算量はどれですか？",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correct: 2,
      explanation: "Pythonの辞書はハッシュテーブルで実装されており、ハッシュ関数でキーから直接格納位置を計算するため、平均 O(1) でアクセスできます。"
    },
    {
      question: "BFS（幅優先探索）で使用するデータ構造はどれですか？",
      options: ["スタック", "キュー", "ヒープ", "連結リスト"],
      correct: 1,
      explanation: "BFSはキュー（FIFO）を使って、スタート地点から近い順にノードを探索します。DFSはスタック（LIFO）を使います。"
    },
    {
      question: "再帰関数に必ず必要な要素は何ですか？",
      options: ["グローバル変数", "ベースケース（終了条件）", "try-except文", "デコレータ"],
      correct: 1,
      explanation: "再帰関数にはベースケース（終了条件）が不可欠です。これがないと無限に自分自身を呼び出し続け、スタックオーバーフロー（RecursionError）が発生します。"
    },
    {
      question: "クイックソートの最悪計算量はどれですか？",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correct: 2,
      explanation: "クイックソートはピボットの選び方が偏ると（例：すでにソート済みのデータ）最悪 O(n²) に劣化します。ただし平均では O(n log n) です。"
    },
    {
      question: "100万件のソート済みデータから特定の値を二分探索で見つけるのに必要な最大比較回数はおよそ何回？",
      options: ["約100回", "約1,000回", "約20回", "約100万回"],
      correct: 2,
      explanation: "二分探索は毎回データを半分に絞るため、log₂(1,000,000) ≈ 20回の比較で答えが見つかります。これが O(log n) の威力です。"
    }
  ],
  python: [
    {
      question: "Pythonで変数に値を代入する正しい方法はどれですか？",
      options: [
        "let name = 'Alice'",
        "var name = 'Alice'",
        "name = 'Alice'",
        "string name = 'Alice'"
      ],
      correct: 2,
      explanation: "Pythonでは型宣言やキーワード（let, var）は不要です。変数名 = 値 の形式でそのまま代入できます。"
    },
    {
      question: "リスト fruits = ['apple', 'banana', 'cherry'] の2番目の要素を取得するには？",
      options: [
        "fruits[2]",
        "fruits[1]",
        "fruits.get(2)",
        "fruits.second()"
      ],
      correct: 1,
      explanation: "Pythonのリストは0から始まるインデックスを使います。fruits[0]='apple'、fruits[1]='banana'、fruits[2]='cherry'です。"
    },
    {
      question: "Pythonで関数を定義するキーワードはどれですか？",
      options: ["function", "func", "def", "fn"],
      correct: 2,
      explanation: "Pythonでは def キーワードで関数を定義します。例: def greet(name): のように使います。"
    },
    {
      question: "f-stringを使って変数nameの値を埋め込む正しい書き方は？",
      options: [
        "f'Hello, {name}!'",
        "'Hello, ${name}!'",
        "'Hello, ' + name + '!'",
        "f'Hello, $name!'"
      ],
      correct: 0,
      explanation: "f-stringは文字列の前にfを付けて、{} の中に変数を書きます。Python 3.6以降で使える便利な機能です。"
    },
    {
      question: "辞書 user = {'name': 'Alice', 'age': 25} から安全に値を取得する方法は？",
      options: [
        "user['email']",
        "user.get('email', 'N/A')",
        "user.email",
        "user->email"
      ],
      correct: 1,
      explanation: "dict.get(key, default) を使うと、キーが存在しない場合にデフォルト値を返します。user['email'] はキーがないと KeyError になります。"
    }
  ,
{"question": "Pythonの辞書（dict）から安全に値を取得するメソッドはどれですか？", "options": ["fetch()", "get()", "pull()", "extract()"], "correct": 1, "explanation": "get() メソッドを使うと、キーが存在しない場合でもエラーでプログラムが止まらず、None または指定したデフォルト値を返します。"},
{"question": "例外処理（エラー対策）で、エラーが起きても処理を継続させるためのキーワードは？", "options": ["try - catch", "try - except", "attempt - fail", "do - catch"], "correct": 1, "explanation": "Pythonでは try と except を使って例外処理を書きます。JSなどの try-catch とはキーワードが異なります。"},
{"question": "リストの要素をループ処理で削除する際の問題を防ぐ最も一般的な方法は？", "options": ["新しいリストを作成する（リスト内包表記など）", "remove()を複数回呼ぶ", "del文を使う", "ループのインデックスを-1ずつ減らす"], "correct": 0, "explanation": "ループ中にリスト自身を変更（破壊的変更）するとインデックスがずれ、バグの原因になります。新しいリストを生成するのが安全です。"},
{"question": "FastAPIでAPIの期待するデータ構造（型）を定義するために使われるライブラリは？", "options": ["SQLAlchemy", "Requests", "Pydantic", "Jinja2"], "correct": 2, "explanation": "Pydantic の BaseModel を継承したクラスを定義することで、FastAPIは自動的にデータのバリデーションと型変換を行います。"},
{"question": "Pythonのデコレータ（@app.get など）の主な役割は何ですか？", "options": ["関数の中身を自動で暗号化する", "関数を呼び出す前後に、既存のコードを変えずに別の処理を追加する", "関数の実行速度を2倍にする", "エラーを完全に握りつぶす"], "correct": 1, "explanation": "デコレータは、既存の関数に後から機能（ログ出力や権限チェックなど）を「トッピング」するための仕組みです。"},
{"question": "yield キーワードを使った「ジェネレータ」の最大のメリットは？", "options": ["コードが1行で書ける", "メモリを大量に消費して高速化する", "必要な分だけデータを生成するため、メモリを節約できる", "自動的にバックアップを取る"], "correct": 2, "explanation": "何万行もあるファイルを読む際など、一度にすべてリストに入れるとメモリがパンクしますが、yield を使えば1行ずつ処理できて安全です。"}
],
  react: [
    {
      question: "ReactのJSXで正しいのはどれですか？",
      options: [
        "<div class='box'>Hello</div>",
        "<div className='box'>Hello</div>",
        "<div css='box'>Hello</div>",
        "<div style='box'>Hello</div>"
      ],
      correct: 1,
      explanation: "JSXではHTMLのclass属性の代わりにclassNameを使います。classはJavaScriptの予約語なので、衝突を避けるためです。"
    },
    {
      question: "Reactコンポーネントの正しい定義方法は？",
      options: [
        "function greeting() { return <h1>Hello</h1>; }",
        "const Greeting = () => { return <h1>Hello</h1>; }",
        "def Greeting(): return <h1>Hello</h1>",
        "class greeting { render() { return <h1>Hello</h1>; } }"
      ],
      correct: 1,
      explanation: "Reactのコンポーネント名は大文字で始める必要があります（PascalCase）。小文字だとHTMLタグと見なされます。"
    },
    {
      question: "useStateフックの正しい使い方はどれですか？",
      options: [
        "const count = useState(0);",
        "const [count, setCount] = useState(0);",
        "const {count, setCount} = useState(0);",
        "let count = React.state(0);"
      ],
      correct: 1,
      explanation: "useStateは配列を返すので、分割代入で [値, 更新関数] の形式で受け取ります。"
    },
    {
      question: "親コンポーネントから子コンポーネントにデータを渡す仕組みを何と呼びますか？",
      options: ["state", "props", "context", "refs"],
      correct: 1,
      explanation: "props（プロパティ）は親から子へデータを渡す仕組みです。stateはコンポーネント内部の状態管理に使います。"
    },
    {
      question: "useEffectで、コンポーネントのマウント時だけ実行するには？",
      options: [
        "useEffect(() => { /* code */ });",
        "useEffect(() => { /* code */ }, []);",
        "useEffect(() => { /* code */ }, null);",
        "useOnMount(() => { /* code */ });"
      ],
      correct: 1,
      explanation: "useEffectの第2引数に空の配列 [] を渡すと、マウント時に1回だけ実行されます。依存配列を省略すると毎レンダー時に実行されます。"
    }
  ,
{"question": "useEffectの第二引数（依存配列）を空の配列 [] にするとどうなりますか？", "options": ["毎回レンダリング時に実行される", "一度も実行されない", "初回マウント時のみ実行される", "エラーになる"], "correct": 2, "explanation": "空の配列を渡すと「依存する値がない＝変化する値がない」とみなされ、最初の1回しか実行されません。API取得によく使われます。"},
{"question": "深い階層のコンポーネントへPropsをバケツリレーせずにデータを渡すReactの機能は？", "options": ["Context API", "Redux", "React Router", "React Query"], "correct": 0, "explanation": "Context API（createContext / useContext）を使うと、中間のコンポーネントを飛ばして直接データを参照できます。"},
{"question": "Reactで無限レンダリングを引き起こす最もよくある原因は？", "options": ["不要なdivタグを使う", "レンダリング中に状態（State）を更新してしまう", "classNameを間違える", "アロー関数を使わない"], "correct": 1, "explanation": "コンポーネントの本体で setState などを直接呼ぶと、状態が更新される→再レンダリングされる→またsetStateが呼ばれる、というループに陥ります。"},
{"question": "Reactの状態（State）として配列を更新する際の正しい書き方は？", "options": ["array.push(newItem)", "array.append(newItem)", "setArray([...array, newItem])", "setArray(array.push(newItem))"], "correct": 2, "explanation": "Reactは「新しい配列/オブジェクトになったか」で変更を検知します。スプレッド構文（...）を使って新しい配列を作る必要があります。"},
{"question": "Reactでカスタムフックを作る際のルールとして正しいものは？", "options": ["関数名を必ず 'use' から始める", "必ず 'function' キーワードを使わないといけない", "中で useEffect を使ってはいけない", "ファイル名を必ず大文字から始める"], "correct": 0, "explanation": "Reactのルールとして、フックは必ず「use」から始まる名前にする必要があります（useFetchなど）。これによりReactがフックとして認識します。"},
{"question": "重い計算処理の結果をキャッシュして、不要な再計算を防ぐReactのフックは？", "options": ["useContext", "useMemo", "useReducer", "useRef"], "correct": 1, "explanation": "useMemoは「計算結果（値）」をメモ化（キャッシュ）します。関数の再生成を防ぐには useCallback を使います。"}
],
  typescript: [
    {
      question: "TypeScriptで変数の型を指定する正しい書き方は？",
      options: [
        "let name: string = 'Alice';",
        "let string name = 'Alice';",
        "let name = (string) 'Alice';",
        "string let name = 'Alice';"
      ],
      correct: 0,
      explanation: "TypeScriptでは 変数名: 型 の形式で型注釈を付けます。コロン(:)の後に型を書くのがTypeScriptの構文です。"
    },
    {
      question: "TypeScriptのinterfaceの正しい定義は？",
      options: [
        "interface User { name: string, age: number }",
        "type interface User { name: string; age: number; }",
        "interface User { name: string; age: number; }",
        "class interface User { name: string; age: number; }"
      ],
      correct: 2,
      explanation: "interfaceはオブジェクトの形を定義します。プロパティの区切りにはセミコロン(;)が推奨です。"
    },
    {
      question: "ジェネリクスを使った関数の正しい書き方は？",
      options: [
        "function first(arr: T[]): T { return arr[0]; }",
        "function first<T>(arr: T[]): T { return arr[0]; }",
        "function first(arr: any[]): any { return arr[0]; }",
        "function first<T>(arr: []): T { return arr[0]; }"
      ],
      correct: 1,
      explanation: "ジェネリクスは<T>のように関数名の後に型パラメータを宣言します。anyを使うと型チェックが効かなくなります。"
    },
    {
      question: "ユニオン型の正しい書き方は？",
      options: [
        "let id: string && number;",
        "let id: string || number;",
        "let id: string | number;",
        "let id: string + number;"
      ],
      correct: 2,
      explanation: "ユニオン型はパイプ(|)で複数の型を組み合わせます。「stringまたはnumberのどちらか」という意味になります。"
    },
    {
      question: "型ガード（type guard）として正しいコードはどれですか？",
      options: [
        "if (typeof value == 'string') { /* ... */ }",
        "if (value is string) { /* ... */ }",
        "if (typeof value === 'string') { /* ... */ }",
        "if (value.type === 'string') { /* ... */ }"
      ],
      correct: 2,
      explanation: "typeof演算子と厳密等価演算子(===)を使って型を判定します。TypeScriptはこのパターンで型を自動的に絞り込みます。"
    }
  ,
{"question": "関数を利用する側で後から型を決定できるTypeScriptの機能は？", "options": ["Any", "Generics（ジェネリクス）", "Interface", "Type Alias"], "correct": 1, "explanation": "ジェネリクス（<T> など）を使うと、関数の再利用性が高まり、かつ実行時に型安全性が保たれます。"},
{"question": "「文字列か数値のどちらか」を表す型定義（Union型）はどれですか？", "options": ["string & number", "string | number", "string || number", "string, number"], "correct": 1, "explanation": "Union型は |（パイプ）を使って定義します。複数の型のうちどれか一つであることを示します。"},
{"question": "TypeScriptで値が null や undefined かもしれない場合に安全にプロパティにアクセスする記号は？", "options": ["!!", "??", "?.", "!"], "correct": 2, "explanation": "オプショナルチェーン（?.）を使うと、値が null/undefined の場合でもエラーにならず undefined を返して安全に処理を続けます。"},
{"question": "TypeScriptで any 型を避けるべき最大の理由は？", "options": ["コンパイルが遅くなるから", "型チェックが完全に無効になりバグに気づけなくなるから", "コードが長くなるから", "他の言語と互換性がなくなるから"], "correct": 1, "explanation": "anyを使うとTypeScriptの最大のメリットである「事前エラー検知」が働かなくなり、単なるJavaScriptと同じになってしまいます。"},
{"question": "TypeScriptの Utility Types のうち、型 T のすべてのプロパティを「任意（省略可能）」にするのはどれ？", "options": ["Omit<T>", "Pick<T>", "Partial<T>", "Record<T>"], "correct": 2, "explanation": "Partial（パーシャル）を使うと、指定した型のすべてのプロパティに ? がつき、部分的な更新APIなどに便利です。"},
{"question": "「obj is Bird」のように、戻り値の型として記述し、TypeScriptに型を教え込む仕組みを何と呼ぶ？", "options": ["Type Casting", "Type Assertion", "Type Guard（ユーザー定義型ガード）", "Type Inference"], "correct": 2, "explanation": "ユーザー定義型ガードを使うと、実行時のバリデーション結果をもとに、コンパイル時にも安全な型付けを強制できます。"}
],
  webapi: [
    {
      question: "バリデーション不一致でFastAPIが返しやすいステータスコードとして最も適切なのはどれですか。",
      options: [
        "200",
        "422",
        "503",
        "404"
      ],
      correct: 1,
      explanation: "FastAPI/Pydanticの入力不一致は一般に422 Unprocessable Entityとして表現されます。"
    },
    {
      question: "フロントで `response.ok` だけを見て処理すると起きやすい問題はどれですか。",
      options: [
        "4xx/5xxの原因分類ができず、UIの復旧導線を作りにくい",
        "JSONが自動でgzip圧縮されなくなる",
        "HTTPメソッドがGETに固定される",
        "TypeScriptの型エラーが消える"
      ],
      correct: 0,
      explanation: "ステータスとエラーボディを分けて扱わないと、通信失敗時の障害診断やユーザーへの案内が難化します。"
    },
    {
      question: "APIレスポンス型設計で `any` を常用すると何が失われますか。",
      options: [
        "型不一致の早期検出",
        "HTTP通信速度",
        "ブラウザ互換性",
        "CORSの許可"
      ],
      correct: 0,
      explanation: "any は型検査を迂回するため、契約破綻（バックエンドの変更によるフロントエンドの崩壊など）の検知能力が落ちます。"
    },
    {
      question: "FastAPIで `response_model` を指定する主な利点はどれですか。",
      options: [
        "返却JSONの形を拘束し、内部情報漏えいを減らせる",
        "必ず通信帯域が半分になる",
        "SQLクエリが自動最適化される",
        "フロントのCSSが自動生成される"
      ],
      correct: 0,
      explanation: "出力契約の強制により、DBのパスワードハッシュなど想定外の内部フィールドが露出するのを防ぎやすくなります。"
    },
    {
      question: "Depends（依存性注入） の導入で最も直接的に得られる効果はどれですか。",
      options: [
        "ルート関数の責務分離とテスト容易性の向上",
        "フロントのCSS自動生成",
        "SSEの自動実装",
        "HTTPからHTTPSへの自動変換"
      ],
      correct: 0,
      explanation: "DBセッションなどの依存資源を抽象化し、ルート関数をテストで差し替えたり再利用したりしやすくします。"
    },
    {
      question: "AbortController を使わずに画面遷移した場合に起きやすい問題はどれですか。",
      options: [
        "古いリクエスト完了後に不正な state 更新が走る",
        "TypeScript が自動無効化される",
        "HTTPステータスが常に200になる",
        "画面がフリーズする"
      ],
      correct: 0,
      explanation: "アンマウント後の更新や、遅れて返ってきた古いレスポンスでの上書きによる状態不整合が典型的です。"
    },
    {
      question: "通信UIで `loading/error/data` を分ける主目的はどれですか。",
      options: [
        "状態遷移を明確化し、表示分岐を安全にする",
        "CSSサイズを削減する",
        "ブラウザ拡張機能を無効化する",
        "メモリ消費を抑える"
      ],
      correct: 0,
      explanation: "非同期画面の曖昧な分岐を減らし、保守性を上げられます。"
    },
    {
      question: "asyncルート内で time.sleep(1) を使うと起きやすい問題はどれですか。",
      options: [
        "event loopが止まり、他リクエストも遅延する",
        "自動で非同期化される",
        "SSEがWebSocketに変換される",
        "Pythonのバージョンが下がる"
      ],
      correct: 0,
      explanation: "同期sleepは非ブロッキングモデルを壊し、サーバーの同時処理能力を大きく落とします。asyncio.sleep() を使う必要があります。"
    },
    {
      question: "SSEイベント区切りとして正しい形式はどれですか。",
      options: [
        "data: <payload> に続けて空行",
        "JSON配列を1回だけ返す",
        "必ずHTTP 204を返す",
        "改行なしのプレーンテキスト"
      ],
      correct: 0,
      explanation: "SSE（Server-Sent Events）は `data:` で始まる行の後に空行（\\n\\n）を送ることで1つのイベントを構成します。"
    }
  ]
};

// --------------------------------------------------
// 2. 進捗管理の状態
// --------------------------------------------------
const state = {
  completedSections: JSON.parse(localStorage.getItem('cf_completed') || '[]'),
  quizAnswered: JSON.parse(localStorage.getItem('cf_quizAnswered') || '{}')
};

// --------------------------------------------------
// 3. 初期化
// --------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initQuizzes();
  initParticles();
  initScrollAnimations();
  restoreProgress();
  updateAllProgress();

  // すべてのlesson-cardにscroll-animateクラスを追加
  document.querySelectorAll('.lesson-card, .quiz-section').forEach(el => {
    el.classList.add('scroll-animate');
  });
});

// --------------------------------------------------
// 4. タブナビゲーション
// --------------------------------------------------
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const indicator = document.getElementById('tab-indicator');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      switchTab(targetTab);
    });
  });

  // 初期インジケーター位置
  requestAnimationFrame(() => {
    const activeBtn = document.querySelector('.tab-button.active');
    if (activeBtn && indicator) updateTabIndicator(activeBtn, indicator);
  });

  // リサイズ時にインジケーター再計算
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.tab-button.active');
    if (activeBtn && indicator) updateTabIndicator(activeBtn, indicator);
  });
}

function switchTab(tabName) {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const indicator = document.getElementById('tab-indicator');

  // ボタンの状態更新
  tabButtons.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (targetBtn) {
    targetBtn.classList.add('active');
    targetBtn.setAttribute('aria-selected', 'true');
    updateTabIndicator(targetBtn, indicator);
  }

  // コンテンツの切り替え
  tabContents.forEach(tc => tc.classList.remove('active'));
  const targetContent = document.getElementById(`content-${tabName}`);
  if (targetContent) {
    targetContent.classList.add('active');
  }

  // アクセントカラーの更新
  const root = document.documentElement;
  if (tabName === 'python') {
    root.style.setProperty('--accent', 'var(--python-blue)');
    root.style.setProperty('--accent-glow', 'rgba(55,118,171,0.35)');
  } else if (tabName === 'react') {
    root.style.setProperty('--accent', 'var(--react-cyan)');
    root.style.setProperty('--accent-glow', 'rgba(97,218,251,0.35)');
  } else {
    root.style.setProperty('--accent', 'var(--typescript-blue)');
    root.style.setProperty('--accent-glow', 'rgba(49,120,198,0.35)');
  }

  // スクロールアニメーションを再トリガー
  requestAnimationFrame(() => {
    targetContent?.querySelectorAll('.scroll-animate').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  });
}

function updateTabIndicator(btn, indicator) {
  if (!indicator || !btn) return;
  const parentRect = btn.parentElement.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  indicator.style.width = `${btnRect.width}px`;
  indicator.style.left = `${btnRect.left - parentRect.left}px`;
}

// --------------------------------------------------
// 5. セクション開閉
// --------------------------------------------------
function toggleSection(headerElement) {
  const card = headerElement.closest('.lesson-card');
  if (!card) return;
  card.classList.toggle('open');
}

// --------------------------------------------------
// 6. コードコピー
// --------------------------------------------------
function copyCode(btn) {
  const codeBlock = btn.closest('.code-block');
  const codeEl = codeBlock?.querySelector('code');
  if (!codeEl) return;

  const text = codeEl.textContent || '';

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyFeedback(btn);
    }).catch(() => {
      fallbackCopy(text);
      showCopyFeedback(btn);
    });
  } else {
    fallbackCopy(text);
    showCopyFeedback(btn);
  }
}

function showCopyFeedback(btn) {
  const originalText = btn.textContent;
  btn.textContent = '✓ コピーしました！';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('copied');
  }, 2000);
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// --------------------------------------------------
// 7. 完了トグル & 進捗管理
// --------------------------------------------------
function toggleComplete(sectionId) {
  const card = document.querySelector(`[data-section="${sectionId}"]`);
  const btn = card?.querySelector('.complete-btn');
  if (!card || !btn) return;

  const idx = state.completedSections.indexOf(sectionId);
  if (idx > -1) {
    state.completedSections.splice(idx, 1);
    card.classList.remove('completed');
    btn.classList.remove('completed');
  } else {
    state.completedSections.push(sectionId);
    card.classList.add('completed');
    btn.classList.add('completed');
  }

  saveProgress();
  updateAllProgress();
}

function restoreProgress() {
  state.completedSections.forEach(sectionId => {
    const card = document.querySelector(`[data-section="${sectionId}"]`);
    if (card) {
      card.classList.add('completed');
      const btn = card.querySelector('.complete-btn');
      if (btn) btn.classList.add('completed');
    }
  });
}

function saveProgress() {
  localStorage.setItem('cf_completed', JSON.stringify(state.completedSections));
  localStorage.setItem('cf_quizAnswered', JSON.stringify(state.quizAnswered));
}

function updateAllProgress() {
  const languages = ['python', 'react', 'typescript', 'python-cert', 'algorithm', 'webapi', 'htmlcss'];
  let totalSections = 0;
  let totalCompleted = 0;

  languages.forEach(lang => {
    const sections = document.querySelectorAll(`#content-${lang} .lesson-card`);
    const completed = state.completedSections.filter(s => s.startsWith(lang)).length;
    const total = sections.length;

    totalSections += total;
    totalCompleted += completed;

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const bar = document.getElementById(`${lang}-progress-bar`);
    const text = document.getElementById(`${lang}-progress-text`);
    if (bar) bar.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}%`;
  });

  const overallPercent = totalSections > 0 ? Math.round((totalCompleted / totalSections) * 100) : 0;
  const overallBar = document.getElementById('overall-progress-bar');
  const overallText = document.getElementById('overall-progress-text');
  if (overallBar) overallBar.style.width = `${overallPercent}%`;
  if (overallText) overallText.textContent = `${overallPercent}% 完了`;
}

// --------------------------------------------------
// 8. クイズシステム
// --------------------------------------------------
function initQuizzes() {
  ['python', 'react', 'typescript', 'python-cert', 'algorithm', 'webapi'].forEach(lang => {
    const container = document.getElementById(`${lang}-quiz-container`);
    if (!container) return;

    const questions = quizData[lang];
    if (!questions) return;

    questions.forEach((q, qIdx) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'quiz-question';
      questionDiv.setAttribute('data-quiz-id', `${lang}-${qIdx}`);

      const letters = ['A', 'B', 'C', 'D'];
      let optionsHtml = '';
      q.options.forEach((opt, optIdx) => {
        optionsHtml += `
          <div class="quiz-option" data-lang="${lang}" data-question="${qIdx}" data-option="${optIdx}"
               onclick="handleQuizAnswer(this, '${lang}', ${qIdx}, ${optIdx})">
            <span class="option-letter">${letters[optIdx]}</span>
            <span class="option-text">${escapeHtml(opt)}</span>
          </div>`;
      });

      questionDiv.innerHTML = `
        <div class="quiz-question-text">
          <span class="quiz-question-number">Q${qIdx + 1}.</span>
          <span>${escapeHtml(q.question)}</span>
        </div>
        <div class="quiz-options">${optionsHtml}</div>`;

      container.appendChild(questionDiv);
    });

    // 以前回答済みのクイズを復元
    restoreQuizAnswers(lang);
  });
}

function handleQuizAnswer(optionEl, lang, questionIdx, selectedIdx) {
  const quizId = `${lang}-${questionIdx}`;

  // 既に回答済みなら無視
  if (state.quizAnswered[quizId] !== undefined) return;

  const correctIdx = quizData[lang][questionIdx].correct;
  const explanation = quizData[lang][questionIdx].explanation;
  const questionDiv = optionEl.closest('.quiz-question');
  const allOptions = questionDiv.querySelectorAll('.quiz-option');

  // 全オプションを無効化
  allOptions.forEach(opt => opt.classList.add('disabled'));

  // 正解/不正解の表示
  if (selectedIdx === correctIdx) {
    optionEl.classList.add('correct');
  } else {
    optionEl.classList.add('incorrect');
    // 正解を表示
    allOptions[correctIdx].classList.add('correct');
  }

  // 解説を表示
  const explanationDiv = document.createElement('div');
  explanationDiv.className = 'quiz-explanation';
  explanationDiv.innerHTML = `💡 <strong>解説:</strong> ${escapeHtml(explanation)}`;
  questionDiv.appendChild(explanationDiv);

  // 状態を保存
  state.quizAnswered[quizId] = selectedIdx;
  saveProgress();

  // 全問回答済みかチェック
  checkQuizCompletion(lang);
}

function checkQuizCompletion(lang) {
  const questions = quizData[lang];
  let answered = 0;
  let correct = 0;

  questions.forEach((q, idx) => {
    const quizId = `${lang}-${idx}`;
    if (state.quizAnswered[quizId] !== undefined) {
      answered++;
      if (state.quizAnswered[quizId] === q.correct) {
        correct++;
      }
    }
  });

  if (answered === questions.length) {
    const resultDiv = document.getElementById(`${lang}-quiz-result`);
    if (!resultDiv) return;

    const percent = Math.round((correct / questions.length) * 100);
    let resultClass, emoji, message;

    if (percent >= 80) {
      resultClass = 'excellent';
      emoji = '🎉';
      message = `素晴らしい！${correct}/${questions.length} 問正解（${percent}%）`;
    } else if (percent >= 60) {
      resultClass = 'good';
      emoji = '👍';
      message = `なかなか良い！${correct}/${questions.length} 問正解（${percent}%）`;
    } else {
      resultClass = 'needs-work';
      emoji = '📚';
      message = `${correct}/${questions.length} 問正解（${percent}%）— もう一度レッスンを復習してみましょう`;
    }

    resultDiv.className = `quiz-result show ${resultClass}`;
    resultDiv.innerHTML = `${emoji} ${message}`;
  }
}

function restoreQuizAnswers(lang) {
  const questions = quizData[lang];
  questions.forEach((q, qIdx) => {
    const quizId = `${lang}-${qIdx}`;
    const savedAnswer = state.quizAnswered[quizId];
    if (savedAnswer === undefined) return;

    const questionDiv = document.querySelector(`[data-quiz-id="${quizId}"]`);
    if (!questionDiv) return;

    const allOptions = questionDiv.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => opt.classList.add('disabled'));

    if (savedAnswer === q.correct) {
      allOptions[savedAnswer].classList.add('correct');
    } else {
      allOptions[savedAnswer].classList.add('incorrect');
      allOptions[q.correct].classList.add('correct');
    }

    // 解説を再追加
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'quiz-explanation';
    explanationDiv.innerHTML = `💡 <strong>解説:</strong> ${escapeHtml(q.explanation)}`;
    questionDiv.appendChild(explanationDiv);
  });

  checkQuizCompletion(lang);
}

// --------------------------------------------------
// 9. パーティクルアニメーション
// --------------------------------------------------
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let isVisible = true;

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  resize();
  window.addEventListener('resize', resize);

  // パーティクルの作成
  const count = Math.min(60, Math.floor(canvas.offsetWidth / 20));
  for (let i = 0; i < count; i++) {
    particles.push(createParticle());
  }

  function createParticle() {
    const colors = [
      'rgba(55, 118, 171, 0.4)',   // Python blue
      'rgba(97, 218, 251, 0.3)',   // React cyan
      'rgba(49, 120, 198, 0.35)',  // TypeScript blue
      'rgba(255, 212, 59, 0.2)',   // Python yellow
    ];
    return {
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    };
  }

  function animate() {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.speedX + Math.sin(p.phase) * 0.1;
      p.y += p.speedY + Math.cos(p.phase) * 0.05;
      p.phase += 0.005;

      // 画面外に出たら反対側から
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // パーティクルを描画
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // グロー効果
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, '0.08)');
      ctx.fill();
    });

    // 近いパーティクル間の線
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(97, 218, 251, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();

  // ページが非表示の時はアニメーションを軽量化
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });
}

// --------------------------------------------------
// 10. スクロールアニメーション
// --------------------------------------------------
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.lesson-card, .quiz-section, .progress-overview').forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}

// --------------------------------------------------
// 11. スムーズスクロール（ヒーローCTA）
// --------------------------------------------------
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  e.preventDefault();
  const targetId = anchor.getAttribute('href').slice(1);
  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// --------------------------------------------------
// 12. プログレスカードのクリック
// --------------------------------------------------
document.addEventListener('click', (e) => {
  const card = e.target.closest('.progress-card');
  if (!card) return;

  const lang = card.dataset.lang;
  if (lang) {
    switchTab(lang);
    // 少し遅延してスクロール
    setTimeout(() => {
      const tabNav = document.getElementById('tab-nav');
      if (tabNav) tabNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
});

// --------------------------------------------------
// ユーティリティ
// --------------------------------------------------
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// グローバルに公開（HTMLのonclick用）
window.toggleSection = toggleSection;
window.toggleComplete = toggleComplete;
window.copyCode = copyCode;
window.switchTab = switchTab;
window.handleQuizAnswer = handleQuizAnswer;



// ==========================================
// Puzzle Logic
// ==========================================

const puzzleData = {

  docker: {
    question: "PythonアプリのDockerfileを正しい順番に並べてください。",
    pieces: [
      { id: "docker-p1", text: "FROM python:3.12-slim" },
      { id: "docker-p2", text: "WORKDIR /app" },
      { id: "docker-p3", text: "COPY requirements.txt ." },
      { id: "docker-p4", text: "RUN pip install -r requirements.txt" },
      { id: "docker-p5", text: "COPY . ." },
      { id: "docker-p6", text: "CMD [\"python\", \"app.py\"]" }
    ],
    correctOrder: ["docker-p1", "docker-p2", "docker-p3", "docker-p4", "docker-p5", "docker-p6"],
    explanation: "ベースイメージ指定→作業ディレクトリ設定→依存ファイルのコピー→パッケージインストール→ソースコードコピー→実行コマンド設定が、キャッシュを最も有効に活用できる正しい順番です。"
  },
  database: {
    question: "売上が1万円以上のユーザーの総売上を計算するSQLを正しい順序に並べてください。",
    pieces: [
      { id: "db-p1", text: "SELECT user_id, SUM(amount) AS total_sales" },
      { id: "db-p2", text: "FROM orders" },
      { id: "db-p3", text: "GROUP BY user_id" },
      { id: "db-p4", text: "HAVING SUM(amount) >= 10000" },
      { id: "db-p5", text: "ORDER BY total_sales DESC;" }
    ],
    correctOrder: ["db-p1", "db-p2", "db-p3", "db-p4", "db-p5"],
    explanation: "SELECT → FROM → GROUP BY(グループ化) → HAVING(グループ化後の条件) → ORDER BY(並び替え) の順序がSQLの正しい構文です。"
  },
  
  
  testing: {
    question: "pytest の fixture を使ったテストコードを正しい順番に並べてください。",
    pieces: [
      { id: "test-p1", text: "import pytest" },
      { id: "test-p2", text: "@pytest.fixture" },
      { id: "test-p3", text: "def sample_data():" },
      { id: "test-p4", text: "    return [\"Alice\", \"Bob\", \"Charlie\"]" },
      { id: "test-p5", text: "def test_data_length(sample_data):" },
      { id: "test-p6", text: "    assert len(sample_data) == 3" }
    ],
    correctOrder: ["test-p1", "test-p2", "test-p3", "test-p4", "test-p5", "test-p6"],
    explanation: "import → @pytest.fixture デコレータ → fixture関数定義 → テストデータ返却 → テスト関数（fixture名を引数に指定）→ アサーション の順序です。"
  },
  "python-prac": {
    question: "デコレータを使って関数の実行時間を計測するコードを正しい順番に並べてください。",
    pieces: [
      { id: "pp-p1", text: "import functools, time" },
      { id: "pp-p2", text: "def timer(func):" },
      { id: "pp-p3", text: "    @functools.wraps(func)" },
      { id: "pp-p4", text: "    def wrapper(*args, **kwargs):" },
      { id: "pp-p5", text: "        start = time.perf_counter()" },
      { id: "pp-p6", text: "        result = func(*args, **kwargs)" },
      { id: "pp-p7", text: "        print(f\"{func.__name__}: {time.perf_counter()-start:.4f}s\")" },
      { id: "pp-p8", text: "        return result" },
      { id: "pp-p9", text: "    return wrapper" }
    ],
    correctOrder: ["pp-p1", "pp-p2", "pp-p3", "pp-p4", "pp-p5", "pp-p6", "pp-p7", "pp-p8", "pp-p9"],
    explanation: "import→デコレータ関数定義→@wrapsで元関数のメタ情報を保持→ラッパー関数→計測開始→元関数実行→結果出力→結果返却→ラッパー関数を返す、の順序です。"
  },
  genai: {
    question: "安全なプロンプトの構成要素を、上から論理的な順序に並べてください。",
    pieces: [
      { id: "gen-p1", text: "# 役割定義：\nあなたはセキュリティの専門家です。" },
      { id: "gen-p2", text: "# 目的：\n以下のコードの脆弱性を指摘してください。" },
      { id: "gen-p3", text: "# 制約条件：\n- 専門用語は避ける\n- 箇条書きで出力する" },
      { id: "gen-p4", text: "# 出力形式：\nJSON形式" },
      { id: "gen-p5", text: "# 入力データ：\nconst pass = '12345';" }
    ],
    correctOrder: ["gen-p1", "gen-p2", "gen-p3", "gen-p4", "gen-p5"],
    explanation: "「役割」で前提を共有し、「目的」を伝え、「制約」と「出力形式」でコントロールし、最後に「対象データ」を渡すのが、ハルシネーションを防ぐ構造化プロンプトの基本です。"
  },

  htmlcss: {
    question: "HTMLの基本構造を正しい順番に組み立ててください",
    pieces: [
      { id: "h1", text: "<!DOCTYPE html>" },
      { id: "h2", text: "<html lang=\"ja\">" },
      { id: "h3", text: "<head><meta charset=\"UTF-8\"><title>My Page</title></head>" },
      { id: "h4", text: "<body>" },
      { id: "h5", text: "<h1>Hello, World!</h1></body></html>" }
    ],
    correctOrder: ["h1", "h2", "h3", "h4", "h5"],
    explanation: "HTML文書は必ず <!DOCTYPE html> 宣言から始まり、<html>、<head>（メタ情報）、<body>（コンテンツ）の順に構成されます。"
  },
  algorithm: {
    question: "二分探索（Binary Search）の関数を正しい順番に組み立ててください",
    pieces: [
      { id: "a1", text: "def binary_search(lst, target):" },
      { id: "a2", text: "    left, right = 0, len(lst) - 1" },
      { id: "a3", text: "    while left <= right:" },
      { id: "a4", text: "        mid = (left + right) // 2" },
      { id: "a5", text: "        if lst[mid] == target: return mid" }
    ],
    correctOrder: ["a1", "a2", "a3", "a4", "a5"],
    explanation: "二分探索は左右の境界（left, right）を設定し、ループで中央値を計算して探索範囲を半分に絞っていきます。"
  },
  python: {
    question: "以下のブロックを正しく並べ替えて、エラーが起きても処理を継続する「0除算の例外処理」を完成させてください。",
    pieces: [
      { id: "p1", text: "def divide(a, b):" },
      { id: "p2", text: "    try:" },
      { id: "p3", text: "        return a / b" },
      { id: "p4", text: "    except ZeroDivisionError:" },
      { id: "p5", text: "        return '0で割ることはできません'" }
    ],
    correctOrder: ["p1", "p2", "p3", "p4", "p5"],
    explanation: "try-exceptブロックを使うことで、エラー時でもプログラムをクラッシュさせずに安全に処理を継続できます。"
  },
  "python-cert": {
    question: "以下のブロックを正しく並べ替えて、リストのすべての要素を処理し、もしbreakされなかった場合のみメッセージを出す「for...else」構文を完成させてください。",
    pieces: [
      { id: "c1", text: "for item in [1, 2, 3]:" },
      { id: "c2", text: "    if item == 5:" },
      { id: "c3", text: "        break" },
      { id: "c4", text: "else:" },
      { id: "c5", text: "    print('5は見つかりませんでした')" }
    ],
    correctOrder: ["c1", "c2", "c3", "c4", "c5"],
    explanation: "for...else 構文は、ループが break されずに自然に終了した場合のみ else ブロックが実行される、試験頻出の特殊構文です。"
  },
  react: {
    question: "以下のブロックを正しく並べ替えて、APIからデータを取得する「useEffect」を用いたコンポーネントを完成させてください。",
    pieces: [
      { id: "r1", text: "function UserProfile() {" },
      { id: "r2", text: "  const [data, setData] = useState(null);" },
      { id: "r3", text: "  useEffect(() => {" },
      { id: "r4", text: "    fetch('/api/user').then(res => res.json()).then(setData);" },
      { id: "r5", text: "  }, []);" }
    ],
    correctOrder: ["r1", "r2", "r3", "r4", "r5"],
    explanation: "コンポーネント関数内でまずStateを宣言し、次にuseEffectを呼び出します。useEffectの第二引数を空配列 [] にすることで初回マウント時のみ実行させます。"
  },
  typescript: {
    question: "以下のブロックを並べ替えて、「User」の型定義を作り、それを引数に取る関数を完成させてください。",
    pieces: [
      { id: "t1", text: "interface User {" },
      { id: "t2", text: "  id: number;" },
      { id: "t3", text: "  name: string;" },
      { id: "t4", text: "}" },
      { id: "t5", text: "function printUser(user: User) {" }
    ],
    correctOrder: ["t1", "t2", "t3", "t4", "t5"],
    explanation: "まず interface でオブジェクトの構造（型）を定義し、関数の引数に対してその Interface 名を指定することで、強力な型チェックを有効にします。"
  },
  webapi: {
    question: "以下のブロックを並べ替えて、非同期処理（async/await）を使った安全なAPIリクエストを完成させてください。",
    pieces: [
      { id: "w1", text: "async function fetchData() {" },
      { id: "w2", text: "  try {" },
      { id: "w3", text: "    const response = await fetch('https://api.example.com/data');" },
      { id: "w4", text: "    const data = await response.json();" },
      { id: "w5", text: "  } catch (error) {" }
    ],
    correctOrder: ["w1", "w2", "w3", "w4", "w5"],
    explanation: "async 関数内で、エラーハンドリングのために try-catch ブロックを配置し、その中で await を使って fetch と json() の非同期処理を待ち受けます。"
  }
};

let draggedPiece = null;

function initPuzzleDropzones() {
  const dropzones = document.querySelectorAll('.puzzle-source, .puzzle-dropzone');
  
  dropzones.forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
      
      const afterElement = getDragAfterElement(zone, e.clientY);
      const draggable = document.querySelector('.dragging');
      if (draggable) {
        if (afterElement == null) {
          zone.appendChild(draggable);
        } else {
          zone.insertBefore(draggable, afterElement);
        }
      }
    });
    
    zone.addEventListener('dragleave', e => {
      zone.classList.remove('drag-over');
    });
    
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      
      // Hide placeholder if pieces are present
      const placeholder = zone.querySelector('.dropzone-placeholder');
      const pieces = zone.querySelectorAll('.puzzle-piece');
      if (placeholder) {
        placeholder.style.display = pieces.length > 0 ? 'none' : 'block';
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.puzzle-piece:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function loadPuzzle(lang) {
  const data = puzzleData[lang];
  if (!data) return;
  
  const questionEl = document.getElementById(lang + '-puzzle-question');
  const sourceZone = document.getElementById(lang + '-puzzle-source');
  const dropZone = document.getElementById(lang + '-puzzle-dropzone');
  const resultEl = document.getElementById(lang + '-puzzle-result');
  
  if (!questionEl || !sourceZone || !dropZone) return;
  
  questionEl.textContent = data.question;
  resultEl.innerHTML = '';
  resultEl.className = 'quiz-result'; // reset class
  
  // Clear zones
  sourceZone.innerHTML = '';
  dropZone.innerHTML = '<div class="dropzone-placeholder">ここにドロップしてコードを完成させる</div>';
  
  // Shuffle pieces
  const shuffled = [...data.pieces].sort(() => Math.random() - 0.5);
  
  shuffled.forEach(piece => {
    const el = document.createElement('div');
    el.className = 'puzzle-piece';
    el.draggable = true;
    el.textContent = piece.text;
    el.dataset.id = piece.id;
    
    el.addEventListener('dragstart', () => {
      el.classList.add('dragging');
      draggedPiece = el;
      
      // Hide placeholder if any
      const placeholder = dropZone.querySelector('.dropzone-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    });
    
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      draggedPiece = null;
      
      // Show placeholder if empty
      const placeholder = dropZone.querySelector('.dropzone-placeholder');
      const piecesInDropzone = dropZone.querySelectorAll('.puzzle-piece');
      if (placeholder) {
        placeholder.style.display = piecesInDropzone.length === 0 ? 'block' : 'none';
      }
    });
    
    sourceZone.appendChild(el);
  });
}

function checkPuzzle(lang) {
  const data = puzzleData[lang];
  if (!data) return;
  
  const dropZone = document.getElementById(lang + '-puzzle-dropzone');
  const resultEl = document.getElementById(lang + '-puzzle-result');
  const pieces = dropZone.querySelectorAll('.puzzle-piece');
  
  if (pieces.length !== data.correctOrder.length) {
    resultEl.innerHTML = '❌ 全てのブロックをドロップエリアに配置してください。';
    resultEl.className = 'quiz-result show needs-work';
    return;
  }
  
  let isCorrect = true;
  pieces.forEach((piece, index) => {
    if (piece.dataset.id !== data.correctOrder[index]) {
      isCorrect = false;
      piece.classList.add('error-anim');
      setTimeout(() => piece.classList.remove('error-anim'), 500);
    } else {
      piece.classList.add('correct-anim');
      setTimeout(() => piece.classList.remove('correct-anim'), 500);
    }
  });
  
  if (isCorrect) {
    resultEl.innerHTML = `✅ <strong>正解！完璧です。</strong><br><br>${data.explanation}`;
    resultEl.className = 'quiz-result show excellent';
  } else {
    resultEl.innerHTML = '❌ 順番が間違っている箇所があります。赤く揺れたブロックを見直してください。';
    resultEl.className = 'quiz-result show needs-work';
  }
}

// Attach to global window load to initialize puzzles
window.addEventListener('DOMContentLoaded', () => {
  initPuzzleDropzones();
  // Load initially for all languages
  ['python', 'python-cert', 'react', 'typescript', 'algorithm', 'webapi'].forEach(lang => {
    loadPuzzle(lang);
  });
});
