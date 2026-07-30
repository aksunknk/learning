// ============================================================
// data/drills.js — 演習ハブ向けの追加ドリル（exerciseData へ合流）
// data/exercises.js の後に読み込むこと。
// ============================================================
(function appendExtraDrills() {
  if (typeof exerciseData === "undefined") return;
  if (!Array.isArray(exerciseData.python)) exerciseData.python = [];

  // 実務リファクタ: ネストした if/別名分岐を対応表へ畳む
  exerciseData.python.push({
    id: "py-write-refactor-normalize-status",
    title: "ステータス正規化のリファクタ",
    prompt:
      "normalize_status(raw) は strip + lower したうえで、active / past_due / canceled に正規化する。" +
      "別名は ok→active、overdue→past_due、cancelled→canceled。" +
      "空・未知は \"unknown\"。ネストした if/elif ではなく対応表（dict）で書く。",
    hint: "ALIAS.get(key, key) のあと許可集合で判定",
    lang: "Python",
    difficulty: "intermediate",
    tags: ["python", "refactor"],
    lesson: "python-10",
    featured: false,
    chapter: "python",
    starter: `ALIAS = {
    "ok": "active",
    "overdue": "past_due",
    "cancelled": "canceled",
}
ALLOWED = {"active", "past_due", "canceled"}

def normalize_status(raw):
    # TODO: 旧来の長い if/elif を対応表へリファクタする
    pass

`,
    tests: `print(normalize_status(" Active "))
print(normalize_status("OK"))
print(normalize_status("overdue"))
print(normalize_status("cancelled"))
print(normalize_status("canceled"))
print(normalize_status("  "))
print(normalize_status("shipped"))`,
    expect: "active\nactive\npast_due\ncanceled\ncanceled\nunknown\nunknown",
  });
})();
