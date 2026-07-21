// ============================================================
// data/exercises.js — コードを書くドリル（合否付き）
// starter を編集し、tests を末尾に連結して実行 → expect と照合する。
// ============================================================
const exerciseData = {
  javascript: [
    {
      id: "js-write-sum",
      title: "配列の合計",
      prompt: "sum(nums) を実装し、数値配列の合計を返してください。空配列は 0 です。",
      hint: "reduce でも for でも可",
      lang: "JavaScript",
      starter: `function sum(nums) {
  // TODO: 実装する
}

`,
      tests: `console.log(sum([1, 2, 3]));
console.log(sum([]));
console.log(sum([-1, 5]));`,
      expect: "6\n0\n4",
    },
    {
      id: "js-write-filter-open",
      title: "未完了タスクを取り出す",
      prompt: "openTasks(tasks) は done === false の要素だけを含む新しい配列を返します。",
      hint: "filter を使うと短い",
      lang: "JavaScript",
      starter: `function openTasks(tasks) {
  // TODO
}

`,
      tests: `const tasks = [
  { title: "learn", done: false },
  { title: "break", done: true },
  { title: "ship", done: false },
];
console.log(openTasks(tasks).map((t) => t.title).join(","));
console.log(openTasks([]).length);`,
      expect: "learn,ship\n0",
    },
    {
      id: "js-write-toggle",
      title: "完了フラグをトグルする",
      prompt: "toggleDone(task) は元オブジェクトを変えず、done を反転した新しいオブジェクトを返します。",
      hint: "スプレッド { ...task, done: !task.done }",
      lang: "JavaScript",
      starter: `function toggleDone(task) {
  // TODO
}

`,
      tests: `const t = { id: "1", title: "ship", done: false };
const u = toggleDone(t);
console.log(u.done);
console.log(t.done);
console.log(toggleDone(u).done);`,
      expect: "true\nfalse\nfalse",
    },
    {
      id: "js-write-validate",
      title: "タイトル検証",
      prompt: "validateTitle(title) は trim 後に空なら false、それ以外 true を返します。",
      hint: "String#trim",
      lang: "JavaScript",
      starter: `function validateTitle(title) {
  // TODO
}

`,
      tests: `console.log(validateTitle("ship"));
console.log(validateTitle("  "));
console.log(validateTitle(""));
console.log(validateTitle(" a "));`,
      expect: "true\nfalse\nfalse\ntrue",
    },
    {
      id: "js-write-count-done",
      title: "完了数を数える",
      prompt: "countDone(tasks) は done が true の件数を返します。",
      hint: "filter.length または reduce",
      lang: "JavaScript",
      starter: `function countDone(tasks) {
  // TODO
}

`,
      tests: `console.log(countDone([
  { done: true }, { done: false }, { done: true }, { done: true },
]));
console.log(countDone([]));`,
      expect: "3\n0",
    },
    {
      id: "js-write-find-by-id",
      title: "ID でタスクを探す",
      prompt: "findTask(tasks, id) は一致する要素を返す。無ければ null。",
      hint: "find ?? null",
      lang: "JavaScript",
      starter: `function findTask(tasks, id) {
  // TODO
}

`,
      tests: `const tasks = [
  { id: "a", title: "one" },
  { id: "b", title: "two" },
];
console.log(findTask(tasks, "b").title);
console.log(findTask(tasks, "z"));`,
      expect: "two\nnull",
    },
    {
      id: "js-write-format-line",
      title: "一覧行を整形する",
      prompt: "formatTask(task) は \"[x] title\"（完了）または \"[ ] title\"（未完了）を返します。",
      hint: "三項演算子",
      lang: "JavaScript",
      starter: `function formatTask(task) {
  // TODO
}

`,
      tests: `console.log(formatTask({ title: "ship", done: true }));
console.log(formatTask({ title: "learn", done: false }));`,
      expect: "[x] ship\n[ ] learn",
    },
    {
      id: "js-write-unique-titles",
      title: "重複タイトルを除く",
      prompt: "uniqueTitles(titles) は登場順を保ったユニークな配列を返します。",
      hint: "Set か includes で判定",
      lang: "JavaScript",
      starter: `function uniqueTitles(titles) {
  // TODO
}

`,
      tests: `console.log(uniqueTitles(["a", "b", "a", "c", "b"]).join(","));
console.log(uniqueTitles([]).length);`,
      expect: "a,b,c\n0",
    },
  ],

  python: [
    {
      id: "py-write-sum",
      title: "リストの合計",
      prompt: "sum_nums(nums) は数値リストの合計を返す。空なら 0。",
      hint: "組み込み sum でも自前ループでも可",
      lang: "Python",
      starter: `def sum_nums(nums):
    # TODO: 実装する
    pass

`,
      tests: `print(sum_nums([1, 2, 3]))
print(sum_nums([]))
print(sum_nums([-1, 5]))`,
      expect: "6\n0\n4",
    },
    {
      id: "py-write-open",
      title: "未完了タイトル",
      prompt: "open_titles(tasks) は done が False の title だけをリストで返す。",
      hint: "リスト内包表記",
      lang: "Python",
      starter: `def open_titles(tasks):
    # TODO
    pass

`,
      tests: `tasks = [
    {"title": "learn", "done": False},
    {"title": "break", "done": True},
    {"title": "ship", "done": False},
]
print(",".join(open_titles(tasks)))
print(len(open_titles([])))`,
      expect: "learn,ship\n0",
    },
    {
      id: "py-write-toggle",
      title: "完了フラグをトグル",
      prompt: "toggle_done(task) は元 dict を変更せず、done を反転した新しい dict を返す。",
      hint: "{**task, \"done\": not task[\"done\"]}",
      lang: "Python",
      starter: `def toggle_done(task):
    # TODO
    pass

`,
      tests: `t = {"id": "1", "title": "ship", "done": False}
u = toggle_done(t)
print(u["done"])
print(t["done"])
print(toggle_done(u)["done"])`,
      expect: "True\nFalse\nFalse",
    },
    {
      id: "py-write-validate",
      title: "タイトル検証",
      prompt: "validate_title(title) は strip 後に空なら False、それ以外 True。",
      hint: "str.strip",
      lang: "Python",
      starter: `def validate_title(title):
    # TODO
    pass

`,
      tests: `print(validate_title("ship"))
print(validate_title("  "))
print(validate_title(""))
print(validate_title(" a "))`,
      expect: "True\nFalse\nFalse\nTrue",
    },
    {
      id: "py-write-count",
      title: "完了数を数える",
      prompt: "count_done(tasks) は done が True の件数を返す。",
      hint: "sum(1 for t in tasks if t[\"done\"])",
      lang: "Python",
      starter: `def count_done(tasks):
    # TODO
    pass

`,
      tests: `print(count_done([
    {"done": True}, {"done": False}, {"done": True}, {"done": True},
]))
print(count_done([]))`,
      expect: "3\n0",
    },
    {
      id: "py-write-find",
      title: "ID で探す",
      prompt: "find_task(tasks, id_) は一致する dict、無ければ None。",
      hint: "次の for / next(..., None)",
      lang: "Python",
      starter: `def find_task(tasks, id_):
    # TODO
    pass

`,
      tests: `tasks = [
    {"id": "a", "title": "one"},
    {"id": "b", "title": "two"},
]
print(find_task(tasks, "b")["title"])
print(find_task(tasks, "z"))`,
      expect: "two\nNone",
    },
    {
      id: "py-write-format",
      title: "一覧行を整形",
      prompt: "format_task(task) は完了なら \"[x] title\"、未完了なら \"[ ] title\"。",
      hint: "三項演算子",
      lang: "Python",
      starter: `def format_task(task):
    # TODO
    pass

`,
      tests: `print(format_task({"title": "ship", "done": True}))
print(format_task({"title": "learn", "done": False}))`,
      expect: "[x] ship\n[ ] learn",
    },
    {
      id: "py-write-unique",
      title: "重複を除く",
      prompt: "unique_titles(titles) は登場順を保ったユニークなリストを返す。",
      hint: "見たキーを set で覚える",
      lang: "Python",
      starter: `def unique_titles(titles):
    # TODO
    pass

`,
      tests: `print(",".join(unique_titles(["a", "b", "a", "c", "b"])))
print(len(unique_titles([])))`,
      expect: "a,b,c\n0",
    },
  ],
};
