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
    {
      id: "ts-write-omit-keys",
      title: "不要なキーを除く",
      prompt: "omit(obj, keys) は keys に含まれるプロパティを除いた新オブジェクト。",
      hint: "Object.keys + includes の否定",
      lang: "TypeScript",
      starter: `function omit(obj, keys) {
  // TODO
}

`,
      tests: `const o = { id: 1, title: "a", secret: "x" };
console.log(JSON.stringify(omit(o, ["secret"])));
console.log(JSON.stringify(omit(o, ["id", "title"])));`,
      expect: '{"id":1,"title":"a"}\n{"secret":"x"}',
    },
    {
      id: "ts-write-ensure-array",
      title: "単一値を配列に揃える",
      prompt: "ensureArray(value) は配列なら浅いコピー、それ以外は [value]（null/undefined も1要素）。",
      hint: "Array.isArray",
      lang: "TypeScript",
      starter: `function ensureArray(value) {
  // TODO
}

`,
      tests: `console.log(JSON.stringify(ensureArray([1, 2])));
console.log(JSON.stringify(ensureArray("x")));
console.log(JSON.stringify(ensureArray(null)));
const src = [9];
const copy = ensureArray(src);
copy.push(1);
console.log(src.length);`,
      expect: "[1,2]\n[\"x\"]\n[null]\n1",
    },
    {
      id: "ts-write-map-status",
      title: "判別可能なユニオンを写像",
      prompt: "labelOf(job) は {status:\"queued\"}→\"待ち\"、{status:\"running\",progress}→\"実行中:\"+progress、{status:\"done\"}→\"完了\"。",
      hint: "job.status で分岐",
      lang: "TypeScript",
      starter: `function labelOf(job) {
  // TODO
}

`,
      tests: `console.log(labelOf({ status: "queued" }));
console.log(labelOf({ status: "running", progress: 40 }));
console.log(labelOf({ status: "done" }));`,
      expect: "待ち\n実行中:40\n完了",
    },
    {
      id: "ts-write-compact",
      title: "nullish を落とす",
      prompt: "compact(obj) は値が null または undefined のキーを除いた新オブジェクト（他の falsy は残す）。",
      hint: "!= null で判定",
      lang: "TypeScript",
      starter: `function compact(obj) {
  // TODO
}

`,
      tests: `console.log(JSON.stringify(compact({ a: 0, b: "", c: null, d: undefined, e: false })));`,
      expect: '{"a":0,"b":"","e":false}',
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
    {
      id: "api-write-bearer",
      title: "Bearer トークンを抜く",
      prompt: "bearerToken(authorization) は \"Bearer <token>\"（大文字小文字無視）なら token、それ以外は null。余分な空白は trim。",
      hint: "startsWith 用に toLowerCase",
      lang: "JavaScript",
      starter: `function bearerToken(authorization) {
  // TODO
}

`,
      tests: `console.log(bearerToken("Bearer abc.def"));
console.log(bearerToken("bearer  xyz  "));
console.log(bearerToken("Basic abc"));
console.log(bearerToken(""));`,
      expect: "abc.def\nxyz\nnull\nnull",
    },
    {
      id: "api-write-retryable",
      title: "リトライすべきか",
      prompt: "shouldRetry(status, attempt, maxAttempts) は attempt < maxAttempts かつ status が 408/429/500/502/503/504 のとき true。",
      hint: "配列 includes",
      lang: "JavaScript",
      starter: `function shouldRetry(status, attempt, maxAttempts) {
  // TODO
}

`,
      tests: `console.log(shouldRetry(503, 0, 3));
console.log(shouldRetry(503, 3, 3));
console.log(shouldRetry(404, 0, 3));
console.log(shouldRetry(429, 1, 2));`,
      expect: "true\nfalse\nfalse\ntrue",
    },
    {
      id: "api-write-json-content-type",
      title: "JSON Content-Type 判定",
      prompt: "isJsonContentType(value) は media type が application/json で始まる（大文字小文字無視、;charset 付き可）なら true。",
      hint: "split(\";\")[0].trim().toLowerCase()",
      lang: "JavaScript",
      starter: `function isJsonContentType(value) {
  // TODO
}

`,
      tests: `console.log(isJsonContentType("application/json"));
console.log(isJsonContentType("Application/JSON; charset=utf-8"));
console.log(isJsonContentType("text/plain"));
console.log(isJsonContentType(""));`,
      expect: "true\ntrue\nfalse\nfalse",
    },
    {
      id: "api-write-merge-headers",
      title: "ヘッダをマージする",
      prompt: "mergeHeaders(base, extra) は浅いマージ。同じキーは extra 優先。キーは与えられた文字列のまま（正規化不要）。",
      hint: "{ ...base, ...extra }",
      lang: "JavaScript",
      starter: `function mergeHeaders(base, extra) {
  // TODO
}

`,
      tests: `console.log(JSON.stringify(mergeHeaders(
  { Accept: "text/plain", "X-Req": "1" },
  { Accept: "application/json" }
)));
console.log(JSON.stringify(mergeHeaders({}, { A: "b" })));`,
      expect: '{"Accept":"application/json","X-Req":"1"}\n{"A":"b"}',
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
    {
      id: "test-write-approx",
      title: "浮動小数の近似比較",
      prompt: "approx_eq(a, b, eps=1e-6) は abs(a-b) <= eps なら True。",
      hint: "abs",
      lang: "Python",
      starter: `def approx_eq(a, b, eps=1e-6):
    # TODO
    pass

`,
      tests: `print(approx_eq(0.1 + 0.2, 0.3))
print(approx_eq(1.0, 1.1, 0.05))
print(approx_eq(1.0, 1.1, 0.2))`,
      expect: "True\nFalse\nTrue",
    },
    {
      id: "test-write-fixture",
      title: "テスト用フィクスチャ",
      prompt: "make_user(**overrides) は {\"id\": 1, \"name\": \"Ada\", \"role\": \"user\"} を基に overrides で上書きした dict。",
      hint: "{**defaults, **overrides}",
      lang: "Python",
      starter: `def make_user(**overrides):
    # TODO
    pass

`,
      tests: `print(make_user())
print(make_user(name="Bob", role="admin"))`,
      expect: "{'id': 1, 'name': 'Ada', 'role': 'user'}\n{'id': 1, 'name': 'Bob', 'role': 'admin'}",
    },
    {
      id: "test-write-spy",
      title: "呼び出しスパイ",
      prompt: "make_spy() は callable を返す。呼ぶたびに引数タプルを .calls に追記し、常に None を返す。",
      hint: "クロージャか簡単なクラス",
      lang: "Python",
      starter: `def make_spy():
    # TODO: 返す関数に calls 属性を付ける
    pass

`,
      tests: `spy = make_spy()
spy(1, 2)
spy("x")
print(spy.calls)`,
      expect: "[(1, 2), ('x',)]",
    },
    {
      id: "test-write-property-commute",
      title: "性質: 交換律チェック",
      prompt: "is_commutative(fn, pairs) は全 (a,b) で fn(a,b)==fn(b,a) なら True。",
      hint: "for で全件",
      lang: "Python",
      starter: `def is_commutative(fn, pairs):
    # TODO
    pass

`,
      tests: `def add(a, b):
    return a + b
def sub(a, b):
    return a - b
print(is_commutative(add, [(1, 2), (0, 5)]))
print(is_commutative(sub, [(1, 2), (3, 3)]))`,
      expect: "True\nFalse",
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

  // DB 行を list[dict] で擬似。本物の SQL エンジンは使わない。
  database: [
    {
      id: "db-write-where",
      title: "WHERE 相当の絞り込み",
      prompt: "where_status(rows, status) は status が一致する行だけの新しいリスト。元は壊さない。",
      hint: "リスト内包 or filter",
      lang: "Python",
      starter: `def where_status(rows, status):
    # TODO
    pass

`,
      tests: `rows = [
  {"id": 1, "status": "open"},
  {"id": 2, "status": "done"},
  {"id": 3, "status": "open"},
]
print(where_status(rows, "open"))
print(rows)`,
      expect:
        "[{'id': 1, 'status': 'open'}, {'id': 3, 'status': 'open'}]\n[{'id': 1, 'status': 'open'}, {'id': 2, 'status': 'done'}, {'id': 3, 'status': 'open'}]",
    },
    {
      id: "db-write-select",
      title: "SELECT 列の射影",
      prompt: "select_cols(rows, cols) は各行から cols のキーだけ残した dict のリスト。",
      hint: "{c: row[c] for c in cols}",
      lang: "Python",
      starter: `def select_cols(rows, cols):
    # TODO
    pass

`,
      tests: `rows = [{"id": 1, "name": "a", "secret": "x"}, {"id": 2, "name": "b", "secret": "y"}]
print(select_cols(rows, ["id", "name"]))`,
      expect: "[{'id': 1, 'name': 'a'}, {'id': 2, 'name': 'b'}]",
    },
    {
      id: "db-write-order-by",
      title: "ORDER BY 昇順",
      prompt: "order_by(rows, key) は key の値で昇順ソートした新リスト（安定でなくてよい）。",
      hint: "sorted(rows, key=lambda r: r[key])",
      lang: "Python",
      starter: `def order_by(rows, key):
    # TODO
    pass

`,
      tests: `rows = [{"id": 3}, {"id": 1}, {"id": 2}]
print(order_by(rows, "id"))
print(rows[0]["id"])`,
      expect: "[{'id': 1}, {'id': 2}, {'id': 3}]\n3",
    },
    {
      id: "db-write-limit",
      title: "LIMIT / OFFSET",
      prompt: "limit_offset(rows, limit, offset=0) は offset から最大 limit 件。",
      hint: "スライス rows[offset:offset+limit]",
      lang: "Python",
      starter: `def limit_offset(rows, limit, offset=0):
    # TODO
    pass

`,
      tests: `rows = [{"id": i} for i in range(1, 6)]
print(limit_offset(rows, 2))
print(limit_offset(rows, 2, 2))`,
      expect: "[{'id': 1}, {'id': 2}]\n[{'id': 3}, {'id': 4}]",
    },
    {
      id: "db-write-inner-join",
      title: "INNER JOIN 相当",
      prompt: "inner_join(left, right, key) は key が一致する組だけ {**L, **R} を並べたリスト。一致なしは捨てる。",
      hint: "二重ループか dict 索引",
      lang: "Python",
      starter: `def inner_join(left, right, key):
    # TODO
    pass

`,
      tests: `left = [{"k": 1, "a": "x"}, {"k": 2, "a": "y"}]
right = [{"k": 2, "b": 9}, {"k": 3, "b": 8}, {"k": 2, "b": 7}]
print(inner_join(left, right, "k"))
print(inner_join(left, [{"k": 9, "b": 1}], "k"))`,
      expect: "[{'k': 2, 'a': 'y', 'b': 9}, {'k': 2, 'a': 'y', 'b': 7}]\n[]",
    },
    {
      id: "db-write-group-count",
      title: "GROUP BY COUNT",
      prompt: "group_count(rows, key) は key の値 → 件数の dict。",
      hint: "collections.Counter でも手書きでも可",
      lang: "Python",
      starter: `def group_count(rows, key):
    # TODO
    pass

`,
      tests: `rows = [{"s": "a"}, {"s": "b"}, {"s": "a"}, {"s": "a"}]
print(dict(sorted(group_count(rows, "s").items())))`,
      expect: "{'a': 3, 'b': 1}",
    },
    {
      id: "db-write-distinct",
      title: "DISTINCT",
      prompt: "distinct_values(rows, key) は key の値の重複なしリスト。初出順を保つ。",
      hint: "seen set",
      lang: "Python",
      starter: `def distinct_values(rows, key):
    # TODO
    pass

`,
      tests: `rows = [{"tag": "js"}, {"tag": "py"}, {"tag": "js"}, {"tag": "go"}]
print(distinct_values(rows, "tag"))`,
      expect: "['js', 'py', 'go']",
    },
    {
      id: "db-write-update",
      title: "UPDATE 相当（非破壊）",
      prompt: "update_where(rows, pred, patch) は pred(row) が真の行だけ {**row, **patch}。他はそのまま。新リストを返す。",
      hint: "リスト内包で分岐",
      lang: "Python",
      starter: `def update_where(rows, pred, patch):
    # TODO
    pass

`,
      tests: `rows = [{"id": 1, "done": False}, {"id": 2, "done": False}]
out = update_where(rows, lambda r: r["id"] == 2, {"done": True})
print(out)
print(rows[1]["done"])`,
      expect: "[{'id': 1, 'done': False}, {'id': 2, 'done': True}]\nFalse",
    },
  ],

  // React 実行環境は無いので、状態更新・派生・reducer を純 JS で判定する。
  react: [
    {
      id: "react-write-defaults",
      title: "Props のデフォルト合成",
      prompt: "withDefaults(props, defaults) は defaults を下に、props で上書きした新オブジェクト。",
      hint: "{ ...defaults, ...props }",
      lang: "JavaScript",
      starter: `function withDefaults(props, defaults) {
  // TODO
}

`,
      tests: `console.log(JSON.stringify(withDefaults({ size: "lg" }, { size: "md", tone: "neutral" })));
console.log(JSON.stringify(withDefaults({}, { open: false })));`,
      expect: '{"size":"lg","tone":"neutral"}\n{"open":false}',
    },
    {
      id: "react-write-toggle-state",
      title: "真偽 state のトグル",
      prompt: "toggleOpen(state) は { ...state, open: !state.open }。元オブジェクトは変えない。",
      hint: "スプレッド",
      lang: "JavaScript",
      starter: `function toggleOpen(state) {
  // TODO
}

`,
      tests: `const s = { open: false, id: 1 };
const n = toggleOpen(s);
console.log(n.open, s.open, n.id);`,
      expect: "true false 1",
    },
    {
      id: "react-write-reducer",
      title: "カウンタ reducer",
      prompt: "counterReducer(state, action) 。action.type が \"inc\" なら +1、\"dec\" なら -1、\"set\" なら action.value。未知は state のまま。",
      hint: "switch / if",
      lang: "JavaScript",
      starter: `function counterReducer(state, action) {
  // TODO: state は number
}

`,
      tests: `console.log(counterReducer(0, { type: "inc" }));
console.log(counterReducer(2, { type: "dec" }));
console.log(counterReducer(9, { type: "set", value: 3 }));
console.log(counterReducer(1, { type: "noop" }));`,
      expect: "1\n1\n3\n1",
    },
    {
      id: "react-write-update-by-id",
      title: "一覧の1件を更新",
      prompt: "updateById(items, id, patch) は id 一致だけ { ...item, ...patch }。他・順序維持。非破壊。",
      hint: "map",
      lang: "JavaScript",
      starter: `function updateById(items, id, patch) {
  // TODO
}

`,
      tests: `const items = [{ id: "a", n: 1 }, { id: "b", n: 2 }];
const next = updateById(items, "b", { n: 9 });
console.log(next.map((x) => x.n).join(","));
console.log(items[1].n);`,
      expect: "1,9\n2",
    },
    {
      id: "react-write-derive-filter",
      title: "表示用に派生フィルタ",
      prompt: "visibleItems(items, query) は title が query を部分一致（大小無視）するもの。query が空文字なら全件。",
      hint: "toLowerCase + includes",
      lang: "JavaScript",
      starter: `function visibleItems(items, query) {
  // TODO
}

`,
      tests: `const items = [{ title: "React Hooks" }, { title: "Vue" }, { title: "react docs" }];
console.log(visibleItems(items, "react").map((i) => i.title).join("|"));
console.log(visibleItems(items, "").length);`,
      expect: "React Hooks|react docs\n3",
    },
    {
      id: "react-write-list-keys",
      title: "安定キーを付与",
      prompt: "withKeys(items) は各要素に key: String(id) を足した新配列（元に id がある前提）。",
      hint: "map でスプレッド",
      lang: "JavaScript",
      starter: `function withKeys(items) {
  // TODO
}

`,
      tests: `console.log(JSON.stringify(withKeys([{ id: 1, t: "a" }, { id: 2, t: "b" }])));`,
      expect: '[{"id":1,"t":"a","key":"1"},{"id":2,"t":"b","key":"2"}]',
    },
    {
      id: "react-write-form-field",
      title: "フォーム1フィールド更新",
      prompt: "setField(form, name, value) は { ...form, [name]: value }。",
      hint: "計算プロパティ名",
      lang: "JavaScript",
      starter: `function setField(form, name, value) {
  // TODO
}

`,
      tests: `console.log(JSON.stringify(setField({ title: "", done: false }, "title", "ship")));
console.log(JSON.stringify(setField({ title: "a", done: false }, "done", true)));`,
      expect: '{"title":"ship","done":false}\n{"title":"a","done":true}',
    },
    {
      id: "react-write-classname",
      title: "className を結合",
      prompt: "cx(...parts) は falsy を除き、文字列だけを空白結合。空なら \"\"。",
      hint: "filter(Boolean).join(\" \")",
      lang: "JavaScript",
      starter: `function cx(...parts) {
  // TODO
}

`,
      tests: `console.log(cx("btn", false, "primary", null, "lg"));
console.log(cx(null, undefined, ""));
console.log(cx("only"));`,
      expect: "btn primary lg\n\nonly",
    },
  ],

  security: [
    {
      id: "sec-write-escape-html",
      title: "HTML エスケープ",
      prompt: "escapeHtml(text) は & < > \" ' を実体参照に置換（& → &amp; を先に）。",
      hint: "順に replace。& を最初に",
      lang: "JavaScript",
      starter: `function escapeHtml(text) {
  // TODO
}

`,
      tests: `console.log(escapeHtml(\`<img src=x onerror="alert(1)">\`));
console.log(escapeHtml("a & b"));`,
      expect:
        "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;\n" +
        "a &amp; b",
    },
    {
      id: "sec-write-detect-sqli",
      title: "危険な SQL 断片を検知",
      prompt: "looksLikeSqli(input) は小文字化後に \"--\" または \";\" または \" drop \" を含めば true。",
      hint: "toLowerCase + includes",
      lang: "JavaScript",
      starter: `function looksLikeSqli(input) {
  // TODO
}

`,
      tests: `console.log(looksLikeSqli("Ada"));
console.log(looksLikeSqli("1; DROP TABLE users"));
console.log(looksLikeSqli("x -- comment"));
console.log(looksLikeSqli("please drop table"));`,
      expect: "false\ntrue\ntrue\ntrue",
    },
    {
      id: "sec-write-same-origin",
      title: "オープンリダイレクト防止",
      prompt: "safeRedirect(url, allowedOrigin) は url が相対パス（/ 始まりで // でない）か、allowedOrigin で始まる絶対 URL なら url、否则は \"/\"。",
      hint: "startsWith を慎重に",
      lang: "JavaScript",
      starter: `function safeRedirect(url, allowedOrigin) {
  // TODO
}

`,
      tests: `console.log(safeRedirect("/home", "https://app.example"));
console.log(safeRedirect("https://app.example/x", "https://app.example"));
console.log(safeRedirect("//evil.test", "https://app.example"));
console.log(safeRedirect("https://evil.test", "https://app.example"));`,
      expect: "/home\nhttps://app.example/x\n/\n/",
    },
    {
      id: "sec-write-authorize",
      title: "所有者チェック（IDOR 防止）",
      prompt: "canAccess(resource, userId, isAdmin) は isAdmin または resource.ownerId === userId なら true。",
      hint: "||",
      lang: "JavaScript",
      starter: `function canAccess(resource, userId, isAdmin) {
  // TODO
}

`,
      tests: `const r = { id: 1, ownerId: "u1" };
console.log(canAccess(r, "u1", false));
console.log(canAccess(r, "u2", false));
console.log(canAccess(r, "u2", true));`,
      expect: "true\nfalse\ntrue",
    },
    {
      id: "sec-write-redact",
      title: "秘密情報を伏せる",
      prompt: "redactSecrets(obj) は password / token キーを \"***\" にした浅いコピー。他キーはそのまま。",
      hint: "コピーして上書き",
      lang: "JavaScript",
      starter: `function redactSecrets(obj) {
  // TODO
}

`,
      tests: `const o = { user: "a", password: "secret", token: "t", n: 1 };
const r = redactSecrets(o);
console.log(JSON.stringify(r));
console.log(o.password);`,
      expect: '{"user":"a","password":"***","token":"***","n":1}\nsecret',
    },
    {
      id: "sec-write-csrf-token",
      title: "CSRF トークン照合",
      prompt: "csrfOk(sessionToken, submitted) は両方とも非空文字列で厳密一致なら true。",
      hint: "typeof と ===",
      lang: "JavaScript",
      starter: `function csrfOk(sessionToken, submitted) {
  // TODO
}

`,
      tests: `console.log(csrfOk("abc", "abc"));
console.log(csrfOk("abc", "xyz"));
console.log(csrfOk("", ""));
console.log(csrfOk(null, "abc"));`,
      expect: "true\nfalse\nfalse\nfalse",
    },
    {
      id: "sec-write-password-policy",
      title: "パスワード最低要件",
      prompt: "passwordOk(pw) は長さ 8 以上かつ、英字と数字を各1以上含めば true。",
      hint: "/[a-zA-Z]/ と /\\d/",
      lang: "JavaScript",
      starter: `function passwordOk(pw) {
  // TODO
}

`,
      tests: `console.log(passwordOk("short1"));
console.log(passwordOk("longenough"));
console.log(passwordOk("longenough1"));
console.log(passwordOk("12345678"));`,
      expect: "false\nfalse\ntrue\nfalse",
    },
    {
      id: "sec-write-has-script",
      title: "script タグ混入を検出",
      prompt: "hasScriptTag(html) は大小無視で \"<script\" を含めば true。",
      hint: "toLowerCase + includes",
      lang: "JavaScript",
      starter: `function hasScriptTag(html) {
  // TODO
}

`,
      tests: `console.log(hasScriptTag("<b>ok</b>"));
console.log(hasScriptTag("<Script src=x>"));
console.log(hasScriptTag("nope"));`,
      expect: "false\ntrue\nfalse",
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
    database: "database-3",
    react: "react-3",
    security: "security-2",
  };
  const tagByChapter = {
    javascript: ["js", "array"],
    python: ["python", "list"],
    algorithm: ["algorithm", "python"],
    typescript: ["typescript", "js"],
    webapi: ["http", "api"],
    testing: ["testing", "python"],
    pathway: ["taskboard", "js"],
    database: ["sql", "python"],
    react: ["react", "js"],
    security: ["security", "js"],
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

