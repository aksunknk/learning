// ============================================================
// data/puzzles.js — コード組み立てパズルのデータ
// app.js から分離。パズルの追加・修正はこのファイルのみで行う。
// ============================================================
const puzzleData = {

  rust: {
    question: "2つの文字列を整数に変換して合計する、? 演算子を使った関数を正しい順番に並べてください。",
    pieces: [
      { id: "rust-p1", text: "fn sum_two(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {" },
      { id: "rust-p2", text: "    let x = a.parse::<i32>()?;" },
      { id: "rust-p3", text: "    let y = b.parse::<i32>()?;" },
      { id: "rust-p4", text: "    Ok(x + y)" },
      { id: "rust-p5", text: "}" }
    ],
    correctOrder: ["rust-p1", "rust-p2", "rust-p3", "rust-p4", "rust-p5"],
    explanation: "関数シグネチャで戻り値を Result にし、? で各変換の失敗を早期リターンで伝播、最後に Ok(x + y) を末尾式として返します。? を使う関数自身の戻り値も Result である必要があります。"
  },
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
  git: {
    question: "機能ブランチで作業してPull Requestを出すまでの流れを正しい順番に並べてください。",
    pieces: [
      { id: "git-p1", text: "git switch -c feature/login-form" },
      { id: "git-p2", text: "# ...ファイルを編集..." },
      { id: "git-p3", text: "git add -p" },
      { id: "git-p4", text: "git commit -m \"Add login form validation\"" },
      { id: "git-p5", text: "git push -u origin feature/login-form" },
      { id: "git-p6", text: "# GitHub で Pull Request を作成" }
    ],
    correctOrder: ["git-p1", "git-p2", "git-p3", "git-p4", "git-p5", "git-p6"],
    explanation: "ブランチ作成 → 編集 → ステージング（add）→ コミット → リモートへpush → PR作成 が GitHub フローの基本サイクルです。mainに直接コミットしない習慣が重要です。"
  },
  capstone: {
    question: "FastAPIのログイン処理の流れを正しい順番に並べてください。",
    pieces: [
      { id: "cap-p1", text: "user = db.query(User).filter(User.email == form.username).first()" },
      { id: "cap-p2", text: "if not user or not pwd_context.verify(form.password, user.hashed_password):" },
      { id: "cap-p3", text: "    raise HTTPException(401, \"invalid credentials\")" },
      { id: "cap-p4", text: "token = jwt.encode({\"sub\": str(user.id), \"exp\": expires}, SECRET_KEY)" },
      { id: "cap-p5", text: "return {\"access_token\": token, \"token_type\": \"bearer\"}" }
    ],
    correctOrder: ["cap-p1", "cap-p2", "cap-p3", "cap-p4", "cap-p5"],
    explanation: "ユーザー検索 → パスワード検証（失敗なら401、どちらが違うかは言わない）→ JWT発行 → トークン返却 が認証エンドポイントの基本構造です。"
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

  sysdesign: {
    question: "HTTPS リクエストがアプリに届くまでの経路を正しい順番に並べてください。",
    pieces: [
      { id: "sd-p1", text: "DNS 解決でホスト名を IP にする" },
      { id: "sd-p2", text: "TCP 接続と TLS ハンドシェイク" },
      { id: "sd-p3", text: "LB / リバースプロキシがアプリへ転送" },
      { id: "sd-p4", text: "API が認可し DB をクエリする" },
      { id: "sd-p5", text: "JSON 応答がブラウザへ戻る" }
    ],
    correctOrder: ["sd-p1", "sd-p2", "sd-p3", "sd-p4", "sd-p5"],
    explanation: "名前解決 → 暗号化通信の確立 → 入口での振り分け → アプリと DB → 応答の復路、が基本の旅です。遅延切り分けはこの順序で層を疑います。"
  },
  devtools: {
    question: "TaskBoard にデータが出ないときの切り分け順を並べてください。",
    pieces: [
      { id: "dt-p1", text: "再現手順を 3 行で書く" },
      { id: "dt-p2", text: "Network で API の status / body を確認" },
      { id: "dt-p3", text: "Console の例外スタックを読む" },
      { id: "dt-p4", text: "Application で localStorage の tasks を見る" },
      { id: "dt-p5", text: "仮説に沿って最小修正 or Issue 化" }
    ],
    correctOrder: ["dt-p1", "dt-p2", "dt-p3", "dt-p4", "dt-p5"],
    explanation: "再現 → 通信 → 例外 → 永続状態 → 修正/記録、の順が 15 分ランブックの基本形です。いきなりコードを書き換えません。"
  },
  pathway: {
    question: "TaskBoard 縦糸の進め方を正しい順番に並べてください。",
    pieces: [
      { id: "path-p1", text: "HTML/CSS で画面骨格を作る" },
      { id: "path-p2", text: "JS + localStorage で CRUD を動かす" },
      { id: "path-p3", text: "REST 契約を書いて API + DB を実装する" },
      { id: "path-p4", text: "React/TS クライアントへ置換しテストで固定する" },
      { id: "path-p5", text: "Docker → CI/CD → セキュリティ点検 → 公開" }
    ],
    correctOrder: ["path-p1", "path-p2", "path-p3", "path-p4", "path-p5"],
    explanation: "静的骨格 → 手元で動く状態 → 契約とサーバー永続化 → モダンフロントとテスト → 梱包・自動化・点検・公開、の順が縦糸の基本型です。いきなり全部を同時に始めません。"
  },
  security: {
    question: "パスワード検証付きログイン処理を正しい順番に並べてください。",
    pieces: [
      { id: "sec-p1", text: "user = db.query(User).filter(User.email == email).first()" },
      { id: "sec-p2", text: "if not user or not pwd.verify(password, user.hashed_password):" },
      { id: "sec-p3", text: "    raise HTTPException(401, \"invalid credentials\")" },
      { id: "sec-p4", text: "token = issue_token(user.id)" },
      { id: "sec-p5", text: "return {\"access_token\": token}" }
    ],
    correctOrder: ["sec-p1", "sec-p2", "sec-p3", "sec-p4", "sec-p5"],
    explanation: "ユーザー検索 → 存在有無とパスワード検証を同じ失敗メッセージで処理 → 成功時のみトークン発行、が認証エンドポイントの基本形です。検証前にトークンを発行してはいけません。"
  },
  cicd: {
    question: "GitHub Actions でテストする最小ジョブを正しい順番に並べてください。",
    pieces: [
      { id: "cicd-p1", text: "jobs:" },
      { id: "cicd-p2", text: "  test:" },
      { id: "cicd-p3", text: "    runs-on: ubuntu-latest" },
      { id: "cicd-p4", text: "    steps:" },
      { id: "cicd-p5", text: "      - uses: actions/checkout@v4" },
      { id: "cicd-p6", text: "      - run: npm ci && npm test" }
    ],
    correctOrder: ["cicd-p1", "cicd-p2", "cicd-p3", "cicd-p4", "cicd-p5", "cicd-p6"],
    explanation: "job を定義し、ランナーを選び、steps で checkout してから依存インストールとテストを実行します。checkout を忘れるとリポジトリが無い空 VM でコマンドが失敗します。"
  },
  linux: {
    question: "ログを検索して件数を数えるコマンド列を正しい順番に並べてください。",
    pieces: [
      { id: "linux-p1", text: "grep -R \"ERROR\" /var/log/app" },
      { id: "linux-p2", text: "  2>/dev/null" },
      { id: "linux-p3", text: "  | sort" },
      { id: "linux-p4", text: "  | uniq -c" },
      { id: "linux-p5", text: "  | sort -nr" }
    ],
    correctOrder: ["linux-p1", "linux-p2", "linux-p3", "linux-p4", "linux-p5"],
    explanation: "grep で ERROR 行を集め、権限エラーは 2>/dev/null で捨て、sort → uniq -c で集計し、sort -nr で件数の多い順に並べます。パイプとリダイレクトの定番パターンです。"
  },
  javascript: {
    question: "async/await で API から JSON を取得する関数を正しい順番に並べてください。",
    pieces: [
      { id: "js-p1", text: "async function fetchUser(id) {" },
      { id: "js-p2", text: "  const res = await fetch(`/api/users/${id}`);" },
      { id: "js-p3", text: "  if (!res.ok) throw new Error(`HTTP ${res.status}`);" },
      { id: "js-p4", text: "  return await res.json();" },
      { id: "js-p5", text: "}" }
    ],
    correctOrder: ["js-p1", "js-p2", "js-p3", "js-p4", "js-p5"],
    explanation: "async 関数で fetch を await し、response.ok で HTTP エラーを明示的に検査してから json() を待ちます。fetch は 404 でも reject しない点に注意してください。"
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
