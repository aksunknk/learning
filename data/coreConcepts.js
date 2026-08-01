// ============================================================
// data/coreConcepts.js — 大項目（カテゴリグループ）ごとの
// 「なぜそう書くのか」BAD / GOOD 比較データ
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
};
