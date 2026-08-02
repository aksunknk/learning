// ============================================================
// data/coreConcepts.js — 「なぜそう書くのか」BAD / GOOD 比較データ
// - グループキー（basics 等）: カテゴリ切替時の既定
// - topics.{tabId}: 個別章（javascript / typescript / react 等）を開いたときの上書き
// ============================================================
const coreConceptData = {
  basics: {
    title: "なぜそう書くのか — 曖昧な比較を捨てる",
    description:
      "基礎では「動くコード」より「意図が読めるコード」を優先します。型の違う値を == で比べると、暗黙変換で意図しない真偽が生まれます。",
    language: "JavaScript",
    badCode: `// BAD: 暗黙変換に依存する
function isActive(flag) {
  if (flag == true) return "on";
  return "off";
}

isActive(1);   // "on" になってしまう
isActive("0"); // 予期しづらい結果`,
    goodCode: `// GOOD: 厳密比較と明示的な型
function isActive(flag) {
  if (flag === true) return "on";
  return "off";
}

isActive(1);    // "off"（数値は真ではない）
isActive(true); // "on"`,
  },

  backend: {
    title: "なぜそう書くのか — 入力を SQL に連結しない",
    description:
      "バックエンドの真実はデータストア側にあります。ユーザー入力を文字列連結すると SQL インジェクションの穴になります。値は必ずバインドします。",
    language: "Python",
    badCode: `# BAD: 入力を SQL 文字列に埋め込む
def find_user(name):
    q = f"SELECT * FROM users WHERE name = '{name}'"
    return db.execute(q)

find_user("a' OR '1'='1")  # 条件を書き換えられる`,
    goodCode: `# GOOD: プレースホルダで値だけ渡す
def find_user(name):
    q = "SELECT * FROM users WHERE name = ?"
    return db.execute(q, (name,))

find_user("a' OR '1'='1")  # ただの文字列として扱われる`,
  },

  frontend: {
    title: "なぜそう書くのか — 状態は直接書き換えない",
    description:
      "React は「前回の state との差分」で描画します。配列やオブジェクトを破壊的に書き換えると、変更に気づかず画面が古いまま残ることがあります。",
    language: "JavaScript",
    badCode: `// BAD: 既存配列を破壊的に変更
function addTask(tasks, title) {
  tasks.push({ title, done: false });
  setTasks(tasks); // 同じ参照 → 再描画されないことがある
}`,
    goodCode: `// GOOD: 新しい配列を返す
function addTask(tasks, title) {
  setTasks([...tasks, { title, done: false }]);
}`,
  },

  practice: {
    title: "なぜそう書くのか — 信頼できない入力を HTML にしない",
    description:
      "実践・試験トラックでは、動かすだけでなく壊し方を先に潰します。ユーザー文字列を innerHTML に入れると XSS の入口になります。",
    language: "JavaScript",
    badCode: `// BAD: 入力を HTML として挿入
function renderName(el, name) {
  el.innerHTML = "<b>" + name + "</b>";
}

renderName(node, "<img src=x onerror=alert(1)>");`,
    goodCode: `// GOOD: テキストとして挿入（必要なら要素を組み立てる）
function renderName(el, name) {
  el.textContent = "";
  const b = document.createElement("b");
  b.textContent = name;
  el.appendChild(b);
}`,
  },

  // 章（トピック）単位の上書き — タブ切替時に優先表示
  topics: {
    javascript: {
      title: "なぜそう書くのか — コールバック地獄をほどく",
      description:
        "ネストした then / コールバックはエラー経路と順序が読みにくくなります。async/await で「上から下」に直し、失敗は try/catch に集約します。",
      language: "JavaScript",
      badCode: `// BAD: ネストした Promise
fetchUser(id)
  .then((u) => fetchPosts(u.id)
    .then((posts) => {
      render(u, posts);
    }));`,
      goodCode: `// GOOD: async/await で直線化
async function loadProfile(id) {
  try {
    const u = await fetchUser(id);
    const posts = await fetchPosts(u.id);
    render(u, posts);
  } catch (err) {
    showError(err);
  }
}`,
    },

    typescript: {
      title: "なぜそう書くのか — any で口を塞がない",
      description:
        "any は型検査を無効化します。外部 JSON は unknown（または Zod）で受け、必要な形だけに絞り込みます。",
      language: "TypeScript",
      badCode: `// BAD: any で握りつぶす
function saveUser(data: any) {
  db.insert(data.email); // 存在しないキーでもコンパイル通過
}`,
      goodCode: `// GOOD: 形を宣言してから使う
type User = { email: string; name: string };

function saveUser(data: User) {
  db.insert(data.email);
}`,
    },

    react: {
      title: "なぜそう書くのか — useEffect に何でも詰め込まない",
      description:
        "レンダー中の setState や、依存配列の誤りは無限ループや古いクロージャの温床です。取得ロジックはフック／純粋関数へ切り出し、依存を明示します。",
      language: "TypeScript",
      badCode: `// BAD: 依存なし + レンダー中に setState しがち
useEffect(() => {
  fetch(\`/api/users/\${userId}\`)
    .then((r) => r.json())
    .then(setUser);
}); // 毎レンダー実行 → ループの危険`,
      goodCode: `// GOOD: 依存を明示し、取得をフックへ
useEffect(() => {
  let cancelled = false;
  fetchUser(userId).then((u) => {
    if (!cancelled) setUser(u);
  });
  return () => { cancelled = true; };
}, [userId]);`,
    },

    reactarch: {
      title: "なぜそう書くのか — アンマウント後も fetch を生かさない",
      description:
        "I/O はコンポーネント寿命より長く生き得る。AbortController で通信を殺し、古い応答による Race Condition を断つ。",
      language: "TypeScript",
      badCode: `// BAD: クリーンアップ無し
useEffect(() => {
  fetch("/api/logs")
    .then((r) => r.json())
    .then(setLogs); // アンマウント後も setState し得る
}, []);`,
      goodCode: `// GOOD: AbortController で打ち切る
useEffect(() => {
  const ac = new AbortController();
  fetch("/api/logs", { signal: ac.signal })
    .then((r) => r.json())
    .then(setLogs)
    .catch((e) => {
      if (e.name === "AbortError") return;
      setError(e);
    });
  return () => ac.abort();
}, []);`,
    },
  },
};
