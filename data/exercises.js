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

  algorithm: [
    {
      id: "algo-linear-search",
      title: "線形探索",
      prompt: "linear_search(arr, target) は最初に見つかった index を返す。無ければ -1。",
      hint: "enumerate で走査",
      lang: "Python",
      starter: `def linear_search(arr, target):
    # TODO
    pass

`,
      tests: `print(linear_search([3, 1, 4, 1, 5], 4))
print(linear_search([3, 1, 4], 9))
print(linear_search([], 1))`,
      expect: "2\n-1\n-1",
    },
    {
      id: "algo-binary-search",
      title: "二分探索（昇順配列）",
      prompt: "binary_search(arr, target) は見つかった index、無ければ -1。arr は昇順ソート済み。",
      hint: "lo/hi を狭める",
      lang: "Python",
      starter: `def binary_search(arr, target):
    # TODO
    pass

`,
      tests: `print(binary_search([1, 3, 5, 7, 9], 7))
print(binary_search([1, 3, 5, 7, 9], 2))
print(binary_search([1], 1))`,
      expect: "3\n-1\n0",
    },
    {
      id: "algo-bubble-sort",
      title: "バブルソート",
      prompt: "bubble_sort(arr) は昇順に並べた新しいリストを返す（元を破壊しない）。",
      hint: "コピーしてから隣接交換",
      lang: "Python",
      starter: `def bubble_sort(arr):
    # TODO
    pass

`,
      tests: `a = [3, 1, 2]
print(bubble_sort(a))
print(a)
print(bubble_sort([]))`,
      expect: "[1, 2, 3]\n[3, 1, 2]\n[]",
    },
    {
      id: "algo-factorial",
      title: "階乗",
      prompt: "factorial(n) は n! を返す（n>=0）。0! は 1。",
      hint: "ループまたは再帰",
      lang: "Python",
      starter: `def factorial(n):
    # TODO
    pass

`,
      tests: `print(factorial(0))
print(factorial(1))
print(factorial(5))`,
      expect: "1\n1\n120",
    },
    {
      id: "algo-fib",
      title: "フィボナッチ",
      prompt: "fib(n) は 0-indexed で F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)。",
      hint: "DP またはループ",
      lang: "Python",
      starter: `def fib(n):
    # TODO
    pass

`,
      tests: `print(fib(0))
print(fib(1))
print(fib(7))`,
      expect: "0\n1\n13",
    },
    {
      id: "algo-two-sum-exists",
      title: "和が target になるペア",
      prompt: "has_pair_sum(arr, target) は異なる二要素の和が target なら True。",
      hint: "見た値を set に入れる",
      lang: "Python",
      starter: `def has_pair_sum(arr, target):
    # TODO
    pass

`,
      tests: `print(has_pair_sum([2, 7, 11, 15], 9))
print(has_pair_sum([2, 7, 11], 100))
print(has_pair_sum([3, 3], 6))`,
      expect: "True\nFalse\nTrue",
    },
  ],

  typescript: [
    {
      id: "ts-write-narrow-string",
      title: "未知の値を string に絞り込む",
      prompt: "asString(value) は typeof が string ならその値、それ以外は null（実行は JS）。",
      hint: "typeof value === \"string\"",
      lang: "TypeScript",
      starter: `function asString(value) {
  // TODO: string だけ通し、他は null
}

`,
      tests: `console.log(asString("hi"));
console.log(asString(1));
console.log(asString(null));`,
      expect: "hi\nnull\nnull",
    },
    {
      id: "ts-write-optional",
      title: "オプショナルのデフォルト",
      prompt: "displayName(user) は user.name があればそれ、無ければ \"anonymous\"。",
      hint: "?? または ||",
      lang: "TypeScript",
      starter: `function displayName(user) {
  // TODO: user は { name?: string } 想定
}

`,
      tests: `console.log(displayName({ name: "Ada" }));
console.log(displayName({}));
console.log(displayName({ name: "" }));`,
      expect: "Ada\nanonymous\nanonymous",
    },
    {
      id: "ts-write-union-status",
      title: "ユニオンでステータス判定",
      prompt: "isSuccess(status) は \"ok\" | \"created\" なら true、他は false。",
      hint: "=== を並べる／includes",
      lang: "TypeScript",
      starter: `function isSuccess(status) {
  // TODO
}

`,
      tests: `console.log(isSuccess("ok"));
console.log(isSuccess("created"));
console.log(isSuccess("error"));`,
      expect: "true\ntrue\nfalse",
    },
    {
      id: "ts-write-pick-keys",
      title: "必要なキーだけ残す",
      prompt: "pick(obj, keys) は keys にあるプロパティだけの新オブジェクト。",
      hint: "keys.forEach でコピー",
      lang: "TypeScript",
      starter: `function pick(obj, keys) {
  // TODO
}

`,
      tests: `const o = { id: 1, title: "a", secret: "x" };
console.log(JSON.stringify(pick(o, ["id", "title"])));
console.log(JSON.stringify(pick(o, ["missing"])));`,
      expect: '{"id":1,"title":"a"}\n{}',
    },
    {
      id: "ts-write-parse-int-safe",
      title: "安全な整数パース",
      prompt: "parseIntSafe(text) は整数として妥当なら number、それ以外は null。",
      hint: "Number / Number.isInteger。空文字は null",
      lang: "TypeScript",
      starter: `function parseIntSafe(text) {
  // TODO
}

`,
      tests: `console.log(parseIntSafe("42"));
console.log(parseIntSafe("3.14"));
console.log(parseIntSafe(""));
console.log(parseIntSafe("x"));`,
      expect: "42\nnull\nnull\nnull",
    },
    {
      id: "ts-write-assert-never-shape",
      title: "結果型を分岐する",
      prompt: "messageFrom(result) は { ok:true, value } なら String(value)、{ ok:false, error } なら error。",
      hint: "result.ok で分岐",
      lang: "TypeScript",
      starter: `function messageFrom(result) {
  // TODO
}

`,
      tests: `console.log(messageFrom({ ok: true, value: 7 }));
console.log(messageFrom({ ok: false, error: "boom" }));`,
      expect: "7\nboom",
    },
  ],

  webapi: [
    {
      id: "api-write-classify-status",
      title: "HTTP ステータス分類",
      prompt: "classifyStatus(code) は 2xx→\"success\", 4xx→\"client\", 5xx→\"server\", 他→\"other\"。",
      hint: "範囲比較",
      lang: "JavaScript",
      starter: `function classifyStatus(code) {
  // TODO
}

`,
      tests: `console.log(classifyStatus(201));
console.log(classifyStatus(422));
console.log(classifyStatus(500));
console.log(classifyStatus(301));`,
      expect: "success\nclient\nserver\nother",
    },
    {
      id: "api-write-build-query",
      title: "クエリ文字列を組み立てる",
      prompt: "buildQuery(params) は {a:1,b:\"x\"} → \"a=1&b=x\"。undefined/null は除外。値は encodeURIComponent。",
      hint: "Object.entries + filter + map",
      lang: "JavaScript",
      starter: `function buildQuery(params) {
  // TODO
}

`,
      tests: `console.log(buildQuery({ limit: 20, q: "a b", empty: null }));
console.log(buildQuery({}));`,
      expect: "limit=20&q=a%20b\n",
    },
    {
      id: "api-write-idempotent-key",
      title: "冪等キーの正規化",
      prompt: "normalizeIdempotencyKey(raw) は trim し、空なら null、それ以外はその文字列。",
      hint: "trim 後の長さ",
      lang: "JavaScript",
      starter: `function normalizeIdempotencyKey(raw) {
  // TODO
}

`,
      tests: `console.log(normalizeIdempotencyKey("  abc  "));
console.log(normalizeIdempotencyKey("   "));
console.log(normalizeIdempotencyKey(""));`,
      expect: "abc\nnull\nnull",
    },
    {
      id: "api-write-error-body",
      title: "エラー JSON を作る",
      prompt: "errorBody(detail, code) は { detail, code } を返す。code 省略時は \"error\"。",
      hint: "デフォルト引数",
      lang: "JavaScript",
      starter: `function errorBody(detail, code) {
  // TODO
}

`,
      tests: `console.log(JSON.stringify(errorBody("Nope", "forbidden")));
console.log(JSON.stringify(errorBody("x")));`,
      expect: '{"detail":"Nope","code":"forbidden"}\n{"detail":"x","code":"error"}',
    },
    {
      id: "api-write-cache-ok",
      title: "キャッシュしてよいか",
      prompt: "canCacheGet(method, status, hasAuth) は GET かつ 200 かつ !hasAuth のときだけ true。",
      hint: "三条件の AND",
      lang: "JavaScript",
      starter: `function canCacheGet(method, status, hasAuth) {
  // TODO
}

`,
      tests: `console.log(canCacheGet("GET", 200, false));
console.log(canCacheGet("GET", 200, true));
console.log(canCacheGet("POST", 200, false));
console.log(canCacheGet("GET", 404, false));`,
      expect: "true\nfalse\nfalse\nfalse",
    },
    {
      id: "api-write-parse-link",
      title: "Location から ID を抜く",
      prompt: "idFromLocation(url) は末尾のパス要素を返す（例: /tasks/42 → \"42\"）。末尾スラッシュは無視。",
      hint: "split(\"/\") して空を除く",
      lang: "JavaScript",
      starter: `function idFromLocation(url) {
  // TODO
}

`,
      tests: `console.log(idFromLocation("/api/tasks/42"));
console.log(idFromLocation("/api/tasks/42/"));
console.log(idFromLocation("https://ex.com/v1/items/abc"));`,
      expect: "42\n42\nabc",
    },
  ],

  testing: [
    {
      id: "test-write-validate-age",
      title: "同値分割: 年齢帯",
      prompt: "age_band(age) は 0-12→child, 13-64→adult, 65+→senior。範囲外は ValueError。",
      hint: "章の同値クラスをコード化",
      lang: "Python",
      starter: `def age_band(age):
    # TODO
    pass

`,
      tests: `print(age_band(10))
print(age_band(30))
print(age_band(70))
try:
    age_band(-1)
    print("noerr")
except ValueError:
    print("err")`,
      expect: "child\nadult\nsenior\nerr",
    },
    {
      id: "test-write-boundary",
      title: "境界値: 含むか",
      prompt: "in_range(n, lo, hi) は lo <= n <= hi なら True（境界含む）。",
      hint: "オフバイワンに注意",
      lang: "Python",
      starter: `def in_range(n, lo, hi):
    # TODO
    pass

`,
      tests: `print(in_range(0, 0, 10))
print(in_range(10, 0, 10))
print(in_range(-1, 0, 10))
print(in_range(11, 0, 10))`,
      expect: "True\nTrue\nFalse\nFalse",
    },
    {
      id: "test-write-assert-eq",
      title: "小さな assert_eq",
      prompt: "assert_eq(actual, expected) は等しければ \"ok\"、それ以外は AssertionError。",
      hint: "raise AssertionError(...)",
      lang: "Python",
      starter: `def assert_eq(actual, expected):
    # TODO
    pass

`,
      tests: `print(assert_eq(1, 1))
try:
    assert_eq(1, 2)
    print("noerr")
except AssertionError:
    print("err")`,
      expect: "ok\nerr",
    },
    {
      id: "test-write-cases",
      title: "テストケース表を評価",
      prompt: "run_cases(fn, cases) は [(args_tuple, expected), ...] を評価し、全成功なら \"PASS\"、それ以外は最初の失敗で \"FAIL:i\"（0始まり）。",
      hint: "enumerate",
      lang: "Python",
      starter: `def run_cases(fn, cases):
    # TODO
    pass

`,
      tests: `def add(a, b):
    return a + b
print(run_cases(add, [((1, 2), 3), ((0, 0), 0)]))
print(run_cases(add, [((1, 2), 3), ((1, 1), 3)]))`,
      expect: "PASS\nFAIL:1",
    },
    {
      id: "test-write-coverage-branches",
      title: "分岐を両方通す入力",
      prompt: "needed_inputs_for_abs() は abs_sign(x) の両分岐を通す入力リストを返す（負と非負を含む）。",
      hint: "例: [-1, 0]",
      lang: "Python",
      starter: `def abs_sign(x):
    if x < 0:
        return "neg"
    return "nonneg"

def needed_inputs_for_abs():
    # TODO: 両分岐を通す値のリスト
    pass

`,
      tests: `vals = needed_inputs_for_abs()
labels = {abs_sign(v) for v in vals}
print("neg" in labels and "nonneg" in labels)
print(len(vals) >= 2)`,
      expect: "True\nTrue",
    },
    {
      id: "test-write-flake-guard",
      title: "決定的な並べ替え",
      prompt: "stable_ids(items) は id で昇順ソートした新リスト（元は壊さない）。Flaky 防止の定石。",
      hint: "sorted(..., key=)",
      lang: "Python",
      starter: `def stable_ids(items):
    # TODO
    pass

`,
      tests: `src = [{"id": 2}, {"id": 1}]
print(stable_ids(src))
print(src)`,
      expect: "[{'id': 1}, {'id': 2}]\n[{'id': 2}, {'id': 1}]",
    },
  ],

  pathway: [
    {
      id: "path-write-create",
      title: "Task を作成する",
      prompt: "createTask(title) は { id, title, done:false }。title は trim。空なら null。id は \"t-\" + Date.now() でなくてよいので固定で \"t-1\" を使ってよい（テストは title/done のみ見る）。",
      hint: "trim して空チェック",
      lang: "JavaScript",
      starter: `function createTask(title) {
  // TODO: 成功時は { id: "t-1", title, done: false }
}

`,
      tests: `const a = createTask("  ship  ");
console.log(a && a.title, a && a.done, a && a.id);
console.log(createTask("  "));`,
      expect: "ship false t-1\nnull",
    },
    {
      id: "path-write-toggle",
      title: "一覧の完了トグル",
      prompt: "toggleInList(tasks, id) は該当 id の done を反転した新配列。他要素・順序は維持。該当なしなら元と同じ内容のコピー。",
      hint: "map",
      lang: "JavaScript",
      starter: `function toggleInList(tasks, id) {
  // TODO
}

`,
      tests: `const tasks = [
  { id: "a", title: "1", done: false },
  { id: "b", title: "2", done: true },
];
const next = toggleInList(tasks, "a");
console.log(next.map((t) => t.done).join(","));
console.log(tasks[0].done);`,
      expect: "true,true\nfalse",
    },
    {
      id: "path-write-remove",
      title: "タスク削除",
      prompt: "removeTask(tasks, id) は id 以外を残した新配列。",
      hint: "filter",
      lang: "JavaScript",
      starter: `function removeTask(tasks, id) {
  // TODO
}

`,
      tests: `const tasks = [{ id: "a" }, { id: "b" }, { id: "c" }];
console.log(removeTask(tasks, "b").map((t) => t.id).join(","));
console.log(tasks.length);`,
      expect: "a,c\n3",
    },
    {
      id: "path-write-serialize",
      title: "localStorage 用シリアライズ",
      prompt: "dumpTasks(tasks) / loadTasks(raw) 。dump は JSON 文字列。load は不正 JSON や非配列なら []。",
      hint: "try/catch + Array.isArray",
      lang: "JavaScript",
      starter: `function dumpTasks(tasks) {
  // TODO
}

function loadTasks(raw) {
  // TODO
}

`,
      tests: `const raw = dumpTasks([{ id: "1", title: "a", done: false }]);
console.log(typeof raw);
console.log(loadTasks(raw)[0].title);
console.log(loadTasks("{").length);
console.log(loadTasks("null").length);`,
      expect: "string\na\n0\n0",
    },
    {
      id: "path-write-open-count",
      title: "未完了件数",
      prompt: "countOpen(tasks) は done === false の件数。",
      hint: "filter.length",
      lang: "JavaScript",
      starter: `function countOpen(tasks) {
  // TODO
}

`,
      tests: `console.log(countOpen([
  { done: false }, { done: true }, { done: false },
]));
console.log(countOpen([]));`,
      expect: "2\n0",
    },
    {
      id: "path-write-rest-path",
      title: "REST パスを組む",
      prompt: "taskPath(id) は \"/tasks/\" + encodeURIComponent(id)。",
      hint: "テンプレート文字列",
      lang: "JavaScript",
      starter: `function taskPath(id) {
  // TODO
}

`,
      tests: `console.log(taskPath("42"));
console.log(taskPath("a/b"));`,
      expect: "/tasks/42\n/tasks/a%2Fb",
    },
  ],
};

// 章横断ハブ用メタ（未指定分の既定値を埋める）
(function enrichExerciseMeta() {
  const lessonByChapter = {
    javascript: "javascript-3",
    python: "python-3",
    algorithm: "algorithm-2",
    typescript: "typescript-2",
    webapi: "webapi-1",
    testing: "testing-2",
    pathway: "pathway-3",
  };
  const tagByChapter = {
    javascript: ["js", "array"],
    python: ["python", "list"],
    algorithm: ["algorithm", "python"],
    typescript: ["typescript", "js"],
    webapi: ["http", "api"],
    testing: ["testing", "python"],
    pathway: ["taskboard", "js"],
  };

  Object.entries(exerciseData).forEach(([chapter, list]) => {
    list.forEach((ex, i) => {
      ex.chapter = chapter;
      if (!ex.difficulty) {
        ex.difficulty = i < 2 ? "beginner" : i < 4 ? "intermediate" : "advanced";
      }
      if (!ex.tags) ex.tags = tagByChapter[chapter] || [chapter];
      if (!ex.lesson) ex.lesson = lessonByChapter[chapter] || `${chapter}-1`;
      if (ex.featured == null) ex.featured = i < 2;
    });
  });
})();

