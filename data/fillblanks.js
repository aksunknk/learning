// ============================================================
// data/fillblanks.js — 穴埋め実行ドリル
// ___ が入力欄になる。実行結果を expect と照合する。
// ============================================================
const fillBlankData = {
  javascript: [
    {
      id: "js-fb-sum",
      title: "配列を合計する",
      hint: "畳み込みに使う配列メソッド名を入れてください",
      lang: "JavaScript",
      template: `const nums = [1, 2, 3];
const sum = nums.___((a, b) => a + b, 0);
console.log(sum);`,
      answers: ["reduce"],
      expect: "6",
    },
    {
      id: "js-fb-filter",
      title: "未完了タスクだけ残す",
      hint: "条件に合う要素だけを残すメソッド",
      lang: "JavaScript",
      template: `const tasks = [
  { title: "learn", done: false },
  { title: "break", done: true },
  { title: "ship", done: false },
];
const open = tasks.___((t) => t.done === false);
console.log(open.map((t) => t.title).join(","));`,
      answers: ["filter"],
      expect: "learn,ship",
    },
    {
      id: "js-fb-json",
      title: "localStorage 用に直列化する",
      hint: "オブジェクト → 文字列",
      lang: "JavaScript",
      template: `const tasks = [{ id: "1", title: "ship", done: false }];
const raw = JSON.___(tasks);
console.log(typeof raw);
console.log(raw.includes("ship"));`,
      answers: ["stringify"],
      expect: "string\ntrue",
    },
  ],
  python: [
    {
      id: "py-fb-comp",
      title: "未完了タイトルをリスト内包で取り出す",
      hint: "内包表記の書き方を完成させてください",
      lang: "Python",
      template: `tasks = [
    {"title": "learn", "done": False},
    {"title": "break", "done": True},
    {"title": "ship", "done": False},
]
open_titles = [t["title"] for t in tasks if t["___"] is False]
print(",".join(open_titles))`,
      answers: ["done"],
      expect: "learn,ship",
    },
    {
      id: "py-fb-get",
      title: "dict.get でデフォルトを返す",
      hint: "キーが無いとき 0 を返すメソッド",
      lang: "Python",
      template: `counts = {"a": 2}
print(counts.___("b", 0))
print(counts.___("a", 0))`,
      answers: ["get", "get"],
      expect: "0\n2",
    },
    {
      id: "py-fb-join",
      title: "パスを安全につなぐ",
      hint: "pathlib の演算子、または文字列結合の定石",
      lang: "Python",
      template: `from pathlib import Path
base = Path("/app")
p = base / "data" / "tasks.___"
print(p.name)`,
      answers: ["json"],
      expect: "tasks.json",
    },
  ],
};
