// ============================================================
// app.js — Code Foundations 学習サイト（ロジック層）
//
// データは data/quizzes.js / data/puzzles.js / data/missions.js、
// レッスン本文は content/*.html に分離済み。
// このファイルは UI 操作・進捗・遅延読込・演習層注入のみを担当する。
// ============================================================

"use strict";

// --------------------------------------------------
// サイト定数
// --------------------------------------------------
// タブの単一レジストリ（表示順 = ナビ・進捗カードの並び順）。
// 新しいタブの追加は (1) content/{id}.html、(2) data/quizzes.js と
// data/puzzles.js のキー、(3) この TABS へのエントリ追加、の3点で完結する。
// 進捗カード・タブボタン・コンテンツ枠・ヒーロー統計は起動時に自動生成される。
// lessons は content/{id}.html の lesson-card 数と同期させる（CIが検証する）。
const TABS = {
  htmlcss:       { label: "HTML/CSS",         short: "HTML",   icon: "🎨", group: "basics",   lessons: 28, accent: "var(--htmlcss-orange)",  glow: "rgba(227,79,38,0.35)" },
  javascript:    { label: "JavaScript",       short: "JS",     icon: "🟨", group: "basics",   lessons: 15, accent: "#f7df1e",                glow: "rgba(247,223,30,0.35)" },
  python:        { label: "Python",           short: "Py",     icon: "🐍", group: "basics",   lessons: 17, accent: "var(--python-blue)",     glow: "rgba(55,118,171,0.35)" },
  algorithm:     { label: "アルゴリズム",     short: "アルゴ", icon: "🧮", group: "basics",   lessons: 8,  accent: "var(--color-warning)",   glow: "rgba(251,191,36,0.35)" },
  rust:          { label: "Rust",             short: "Rust",   icon: "🦀", group: "basics",   lessons: 14, accent: "#ce422b",                glow: "rgba(206,66,43,0.35)" },
  typescript:    { label: "TypeScript",       short: "TS",     icon: "🔷", group: "basics",   lessons: 15, accent: "var(--typescript-blue)", glow: "rgba(49,120,198,0.35)" },
  git:           { label: "Git / GitHub",     short: "Git",    icon: "🌿", group: "basics",   lessons: 8,  accent: "var(--git-orange)",      glow: "rgba(240,80,51,0.35)" },
  linux:         { label: "Linux / CLI",      short: "Linux",  icon: "🐧", group: "basics",   lessons: 14, accent: "#fcc624",                glow: "rgba(252,198,36,0.35)" },
  devtools:      { label: "DevTools",         short: "Dev",    icon: "🧭", group: "basics",   lessons: 12, accent: "#6366f1",                glow: "rgba(99,102,241,0.35)" },
  database:      { label: "データベース",     short: "DB",     icon: "🗄️", group: "backend",  lessons: 16, accent: "var(--database-teal)",   glow: "rgba(0,150,136,0.35)" },
  webapi:        { label: "Web/API",          short: "API",    icon: "🌐", group: "backend",  lessons: 14, accent: "var(--webapi-green)",    glow: "rgba(0,191,165,0.35)" },
  docker:        { label: "Docker",           short: "Docker", icon: "🐳", group: "backend",  lessons: 14, accent: "var(--docker-blue)",     glow: "rgba(36,150,237,0.35)" },
  cicd:          { label: "CI/CD・デプロイ",  short: "CI/CD",  icon: "🚀", group: "backend",  lessons: 12, accent: "#2088ff",                glow: "rgba(32,136,255,0.35)" },
  react:         { label: "React",            short: "React",  icon: "⚛️", group: "frontend", lessons: 17, accent: "var(--react-cyan)",      glow: "rgba(97,218,251,0.35)" },
  "python-cert": { label: "Python認定基礎",   short: "認定",   icon: "📜", group: "practice", lessons: 10, accent: "var(--python-yellow)",   glow: "rgba(255,212,59,0.35)" },
  "python-prac": { label: "Python実践試験",   short: "実践",   icon: "🏆", group: "practice", lessons: 10, accent: "var(--python-blue)",     glow: "rgba(55,118,171,0.35)" },
  testing:       { label: "テスト設計",       short: "Test",   icon: "🧪", group: "practice", lessons: 14, accent: "var(--testing-green)",   glow: "rgba(76,175,80,0.35)" },
  security:      { label: "セキュリティ",     short: "Sec",    icon: "🔒", group: "practice", lessons: 12, accent: "#e11d48",                glow: "rgba(225,29,72,0.35)" },
  sysdesign:     { label: "システム設計",     short: "設計",   icon: "📐", group: "practice", lessons: 16, accent: "#7c3aed",                glow: "rgba(124,58,237,0.35)" },
  pathway:       { label: "通しプロジェクト", short: "縦糸",   icon: "🧵", group: "practice", lessons: 12, accent: "#0f766e",                glow: "rgba(15,118,110,0.35)" },
  genai:         { label: "生成AIパスポート", short: "AI",     icon: "🤖", group: "practice", lessons: 8,  accent: "var(--genai-purple)",    glow: "rgba(156,39,176,0.35)" },
  capstone:      { label: "キャップストーン", short: "Cap",    icon: "🏗️", group: "practice", lessons: 10, accent: "var(--capstone-gold)",   glow: "rgba(255,179,0,0.35)" },
};

const TAB_IDS = Object.keys(TABS);
const DEFAULT_TAB = "htmlcss";

// 学習ロードマップ（推奨順）。フルスタックエンジニアへの最短経路。
// ラベル・アイコンは TABS から導出する。
// ここに無いタブ（資格・知識系・Rust など）は補強コンテンツとして別枠表示する。
const ROADMAP = [
  "htmlcss",
  "javascript",
  "python",
  "git",
  "linux",
  "devtools",
  "algorithm",
  "database",
  "webapi",
  "docker",
  "cicd",
  "react",
  "typescript",
  "testing",
  "security",
  "sysdesign",
  "pathway",
  "capstone",
].map((tab) => ({ tab, ...TABS[tab] }));

const STORAGE_KEYS = {
  completed: "cf_completed",
  quizAnswered: "cf_quizAnswered",
  missions: "cf_missions",
  rubrics: "cf_rubrics",
};

// タブ別コンテンツの読込状態（未読込 / 読込中 / 完了）
const contentCache = Object.create(null);

// --------------------------------------------------
// 進捗状態
// --------------------------------------------------
function safeParse(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

const state = {
  completedSections: safeParse(STORAGE_KEYS.completed, []),
  quizAnswered: safeParse(STORAGE_KEYS.quizAnswered, {}),
};

// --------------------------------------------------
// 初期化（単一エントリーポイント）
// --------------------------------------------------
const lastTabByGroup = {};

document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  initTabs();
  initDisclosures();
  initStickyNavCompact();
  setActiveTabGroup("basics");
  initParticles();
  initScrollAnimations();
  initPuzzleDropzones();
  renderRoadmap();
  initSearch();
  initProgressIO();

  // 初期表示タブを先に読み込み、進捗・クイズ・パズルを有効化する
  const initial =
    document.querySelector(".tab-button.active")?.dataset.tab || "htmlcss";
  lastTabByGroup[TABS[initial]?.group || "basics"] = initial;
  await loadTabContent(initial);

  restoreProgress();
  updateAllProgress();
});

// --------------------------------------------------
// シェル生成
// --------------------------------------------------
// index.html にはコンテナのみを置き、タブ由来の反復DOM
// （進捗カード・タブボタン・コンテンツ枠）とヒーロー統計は
// TABS レジストリから起動時に生成する。
// これによりタブ追加時の index.html 編集が不要になる。
function renderShell() {
  const cards = document.querySelector(".progress-cards");
  if (cards) {
    cards.innerHTML = TAB_IDS.map((id) => {
      const t = TABS[id];
      return `
        <div class="progress-card" data-lang="${id}">
          <div class="progress-card-icon">${t.icon}</div>
          <div class="progress-card-info">
            <h3>${escapeHtml(t.label)}</h3>
            <div class="mini-progress-bar">
              <div class="mini-progress-fill" id="${id}-progress-bar" style="background:${t.accent}"></div>
            </div>
            <span class="progress-percent" id="${id}-progress-text">0%</span>
          </div>
        </div>`;
    }).join("");
  }

  const tabList = document.querySelector(".tab-list");
  if (tabList) {
    tabList.innerHTML = TAB_IDS.map((id) => {
      const t = TABS[id];
      const active = id === DEFAULT_TAB;
      const short = t.short || t.label;
      return `
        <button class="tab-button${active ? " active" : ""}" data-tab="${id}"
                data-group="${t.group}" role="tab" aria-selected="${active}"
                aria-controls="content-${id}"
                id="tab-${id}"${active ? "" : " hidden"}>
          <span class="tab-icon" aria-hidden="true">${t.icon}</span>
          <span class="tab-label">${escapeHtml(t.label)}</span>
          <span class="tab-label-short">${escapeHtml(short)}</span>
        </button>`;
    }).join("");
  }

  const panels = document.getElementById("tab-panels");
  if (panels) {
    panels.innerHTML = TAB_IDS.map(
      (id) => `
        <div class="tab-content${id === DEFAULT_TAB ? " active" : ""}" id="content-${id}"
             role="tabpanel" aria-labelledby="tab-${id}"
             data-content-src="content/${id}.html" aria-busy="true">
          <div class="content-placeholder">
            <div class="content-spinner" aria-hidden="true"></div>
            <p>コンテンツを読み込み中…</p>
          </div>
        </div>`
    ).join("");
  }

  renderCatalogStats();
}

// カタログ統計は TABS / quizData / puzzleData から算出する
// （手動更新による実数との乖離を防ぐ）。
function renderCatalogStats() {
  renderHeroStats(); // 後方互換エイリアス
}

function renderHeroStats() {
  const stats = {
    topics: TAB_IDS.length,
    lessons: TAB_IDS.reduce((n, id) => n + TABS[id].lessons, 0),
    quizzes:
      typeof quizData !== "undefined"
        ? Object.values(quizData).reduce((n, qs) => n + qs.length, 0)
        : 0,
    puzzles: typeof puzzleData !== "undefined" ? Object.keys(puzzleData).length : 0,
  };
  document.querySelectorAll("[data-stat]").forEach((el) => {
    const v = stats[el.dataset.stat];
    if (v !== undefined) el.textContent = String(v);
  });
}

// --------------------------------------------------
// コンテンツ遅延読込
// --------------------------------------------------
// content/{tabId}.html を fetch してタブパネルへ注入する。
// 一度読み込んだタブは contentCache に保持し、再 fetch しない。
// GitHub Pages 等の HTTP(S) 配信を前提とする（file:// では CORS で失敗する）。
async function loadTabContent(tabId) {
  const panel = document.getElementById(`content-${tabId}`);
  if (!panel) return;

  if (contentCache[tabId] === "loaded") return;
  if (contentCache[tabId] === "loading") {
    await waitUntil(() => contentCache[tabId] === "loaded" || contentCache[tabId] === "error");
    return;
  }

  const src = panel.dataset.contentSrc;
  if (!src) return;

  contentCache[tabId] = "loading";
  panel.setAttribute("aria-busy", "true");

  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    panel.innerHTML = html;
    panel.setAttribute("aria-busy", "false");
    contentCache[tabId] = "loaded";

    // 編末 Mini Mission / 章末ルーブリック / TaskBoard 適用 / 穴埋めを注入
    injectPracticeLayer(tabId, panel);
    injectTaskBoardApply(tabId, panel);
    injectFillBlankSection(tabId, panel);
    injectWriteExercises(tabId, panel);
    injectCrossRefs(panel);

    // 注入後にタブ固有のインタラクションを初期化
    initQuizForTab(tabId);
    loadPuzzle(tabId);
    prepareFillBlankBlocks(panel);
    bindWriteExercises(panel);
    attachRunButtons(panel);
    enhanceLessonHeaders(panel);
    observeScrollTargets(panel);
    restoreProgress();
    updateAllProgress();

    // Database タブは SQL プレイグラウンドの起動UIを含む
    // （sql.js 本体はユーザーが起動ボタンを押すまでダウンロードしない）
  } catch (err) {
    contentCache[tabId] = "error";
    panel.setAttribute("aria-busy", "false");
    panel.innerHTML = `
      <div class="content-placeholder content-error">
        <p>コンテンツの読み込みに失敗しました。</p>
        <p class="content-error-detail">${escapeHtml(String(err.message || err))}</p>
        <button type="button" class="retry-load-btn" onclick="retryLoadTab('${tabId}')">再試行</button>
      </div>`;
  }
}

function retryLoadTab(tabId) {
  contentCache[tabId] = null;
  return loadTabContent(tabId);
}

// --------------------------------------------------
// Mini Mission / 章末ルーブリック（data/missions.js）
// --------------------------------------------------
function findTierSeparator(panel, label) {
  return [...panel.querySelectorAll(".explanation-box h4")].find((h) =>
    h.textContent.includes(label)
  )?.closest(".explanation-box");
}

function buildMissionElement(tabId, tierKey, mission) {
  const section = document.createElement("section");
  section.className = "mini-mission";
  section.dataset.missionTier = tierKey;
  section.setAttribute("aria-label", mission.title);

  const tasksHtml = (mission.tasks || [])
    .map((task, i) => {
      const id = `${tabId}:${tierKey}:${i}`;
      return `<li>
        <label class="mini-mission-task">
          <input type="checkbox" data-mission-id="${escapeHtml(id)}" />
          <span>${escapeHtml(task)}</span>
        </label>
      </li>`;
    })
    .join("");

  let starterHtml = "";
  if (mission.starter?.code) {
    starterHtml = `
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">${escapeHtml(mission.starter.lang || "Code")}</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 コピー</button>
        </div>
        <pre><code>${escapeHtml(mission.starter.code)}</code></pre>
      </div>`;
  }

  section.innerHTML = `
    <div class="mini-mission-header">
      <h4>🎯 ${escapeHtml(mission.title)}</h4>
      <span class="mini-mission-meta">目安 ${Number(mission.minutes) || 20} 分</span>
    </div>
    <p class="mini-mission-goal"><strong>ゴール:</strong> ${escapeHtml(mission.goal || "")}</p>
    <ul class="mini-mission-tasks">${tasksHtml}</ul>
    ${starterHtml}
    <p class="mini-mission-hint">チェックは端末に保存されます。全部付けてから次の編へ進むのが推奨ルートです。</p>
  `;
  return section;
}

function buildRubricElement(tabId, rubric) {
  const section = document.createElement("section");
  section.className = "chapter-rubric";
  section.setAttribute("aria-label", "章末ルーブリック");

  const rows = rubric
    .map((item) => {
      const id = `${tabId}:${item.id}`;
      return `<tr>
        <th scope="row">${escapeHtml(item.label)}</th>
        <td>
          <select data-rubric-id="${escapeHtml(id)}" aria-label="${escapeHtml(item.label)}">
            <option value="todo">未着手</option>
            <option value="partial">曖昧</option>
            <option value="done">できた</option>
          </select>
        </td>
      </tr>`;
    })
    .join("");

  section.innerHTML = `
    <div class="chapter-rubric-header">
      <h4>📋 章末ルーブリック（自己採点）</h4>
    </div>
    <p class="chapter-rubric-intro">「読んだ」ではなく「できる」を3段階で記録します。曖昧が残る項目は関連レッスンへ戻ってください。</p>
    <table class="chapter-rubric-table">
      <thead><tr><th>観点</th><th>自己評価</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  return section;
}

function restorePracticeState(panel) {
  const missions = safeParse(STORAGE_KEYS.missions, {});
  panel.querySelectorAll("input[data-mission-id]").forEach((input) => {
    input.checked = !!missions[input.dataset.missionId];
  });
  const rubrics = safeParse(STORAGE_KEYS.rubrics, {});
  panel.querySelectorAll("select[data-rubric-id]").forEach((select) => {
    const v = rubrics[select.dataset.rubricId];
    if (v) select.value = v;
  });
}

function bindPracticeLayer(panel) {
  panel.querySelectorAll("input[data-mission-id]").forEach((input) => {
    input.addEventListener("change", () => {
      const all = safeParse(STORAGE_KEYS.missions, {});
      if (input.checked) all[input.dataset.missionId] = true;
      else delete all[input.dataset.missionId];
      localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify(all));
    });
  });
  panel.querySelectorAll("select[data-rubric-id]").forEach((select) => {
    select.addEventListener("change", () => {
      const all = safeParse(STORAGE_KEYS.rubrics, {});
      all[select.dataset.rubricId] = select.value;
      localStorage.setItem(STORAGE_KEYS.rubrics, JSON.stringify(all));
    });
  });
}

function injectPracticeLayer(tabId, panel) {
  if (!panel || panel.dataset.missionsInjected === "1") return;
  if (typeof missionData === "undefined" || !missionData[tabId]) return;

  const data = missionData[tabId];
  const midSep = findTierSeparator(panel, "中級編");
  const advSep = findTierSeparator(panel, "上級編");
  const frameworkSep = findTierSeparator(panel, "フレームワーク編");
  const quizEl =
    panel.querySelector(`#${tabId}-quiz`) ||
    panel.querySelector(".quiz-section");

  if (data.beginner && midSep) {
    midSep.parentNode.insertBefore(
      buildMissionElement(tabId, "beginner", data.beginner),
      midSep
    );
  }
  if (data.intermediate && advSep) {
    advSep.parentNode.insertBefore(
      buildMissionElement(tabId, "intermediate", data.intermediate),
      advSep
    );
  }

  const advancedAnchor = frameworkSep || quizEl;
  if (data.advanced && advancedAnchor) {
    advancedAnchor.parentNode.insertBefore(
      buildMissionElement(tabId, "advanced", data.advanced),
      advancedAnchor
    );
  } else if (data.mission && quizEl) {
    quizEl.parentNode.insertBefore(
      buildMissionElement(tabId, "chapter", data.mission),
      quizEl
    );
  }

  if (data.rubric?.length && quizEl) {
    quizEl.parentNode.insertBefore(buildRubricElement(tabId, data.rubric), quizEl);
  }

  // ティア区切りが無い章で beginner だけ定義されている場合のフォールバックは不要
  // （git/testing 等は mission + rubric のみ）

  panel.dataset.missionsInjected = "1";
  restorePracticeState(panel);
  bindPracticeLayer(panel);
}

window.injectPracticeLayer = injectPracticeLayer;

function injectCrossRefs(panel) {
  if (!panel || typeof crossRefData === "undefined") return;
  if (panel.dataset.crossRefsInjected === "1") return;

  panel.querySelectorAll(".lesson-card[data-section]").forEach((card) => {
    const id = card.dataset.section;
    const links = crossRefData[id];
    if (!links?.length || card.querySelector(".cross-refs")) return;

    const body = card.querySelector(".lesson-body") || card;
    const nav = document.createElement("nav");
    nav.className = "cross-refs";
    nav.setAttribute("aria-label", "関連レッスン");
    nav.innerHTML = `
      <span class="cross-refs-label">関連</span>
      <ul class="cross-refs-list">
        ${links
          .map(
            (l) => `<li>
          <button type="button" class="cross-ref-link"
            onclick="jumpToLesson('${escapeHtml(l.tab)}','${escapeHtml(l.section)}')">
            ${escapeHtml(l.label)}
            <span class="cross-ref-id">${escapeHtml(l.section)}</span>
          </button>
        </li>`
          )
          .join("")}
      </ul>`;
    body.appendChild(nav);
  });

  panel.dataset.crossRefsInjected = "1";
}

window.injectCrossRefs = injectCrossRefs;

function injectTaskBoardApply(tabId, panel) {
  if (!panel || panel.dataset.taskboardInjected === "1") return;
  if (typeof taskBoardApplyData === "undefined" || !taskBoardApplyData[tabId]) return;

  const data = taskBoardApplyData[tabId];
  const quizEl =
    panel.querySelector(`#${tabId}-quiz`) ||
    panel.querySelector(".quiz-section");
  if (!quizEl) return;

  const section = document.createElement("section");
  section.className = "taskboard-apply";
  section.setAttribute("aria-label", "TaskBoard に適用する");
  const tasksHtml = (data.tasks || [])
    .map(
      (task, i) => `<li>
        <label class="mini-mission-task">
          <input type="checkbox" data-taskboard-id="${escapeHtml(`${tabId}:${i}`)}" />
          <span>${escapeHtml(task)}</span>
        </label>
      </li>`
    )
    .join("");

  section.innerHTML = `
    <div class="mini-mission-header">
      <h4>🧵 TaskBoard に適用する</h4>
      <span class="mini-mission-meta">目安 ${escapeHtml(String(data.minutes || 20))} 分</span>
    </div>
    <p class="mini-mission-goal">${escapeHtml(data.goal)}</p>
    <ul class="mini-mission-tasks">${tasksHtml}</ul>
    <p class="taskboard-apply-link">
      <button type="button" class="cross-ref-link"
        onclick="jumpToLesson('pathway','${escapeHtml(data.pathway)}')">
        通しプロジェクト ${escapeHtml(data.pathway)} を開く
        <span class="cross-ref-id">${escapeHtml(data.pathway)}</span>
      </button>
    </p>`;

  quizEl.parentNode.insertBefore(section, quizEl);
  panel.dataset.taskboardInjected = "1";

  try {
    const saved = JSON.parse(localStorage.getItem("cf_taskboard") || "{}");
    section.querySelectorAll("input[data-taskboard-id]").forEach((input) => {
      input.checked = !!saved[input.dataset.taskboardId];
      input.addEventListener("change", () => {
        const next = JSON.parse(localStorage.getItem("cf_taskboard") || "{}");
        next[input.dataset.taskboardId] = input.checked;
        localStorage.setItem("cf_taskboard", JSON.stringify(next));
      });
    });
  } catch {
    /* ignore storage errors */
  }
}

window.injectTaskBoardApply = injectTaskBoardApply;

function injectFillBlankSection(tabId, panel) {
  if (!panel || panel.dataset.fillblanksInjected === "1") return;
  if (typeof fillBlankData === "undefined" || !fillBlankData[tabId]?.length) return;

  const quizEl =
    panel.querySelector(`#${tabId}-quiz`) ||
    panel.querySelector(".quiz-section");
  if (!quizEl) return;

  const wrap = document.createElement("section");
  wrap.className = "fillblank-section";
  wrap.setAttribute("aria-label", "穴埋め実行ドリル");
  wrap.innerHTML = `<div class="quiz-header"><h3>⌨️ 穴埋め実行ドリル</h3></div>
    <p class="quiz-intro">___ を埋めて ▶ 実行し、期待出力と一致するか確認します。</p>`;

  fillBlankData[tabId].forEach((ex) => {
    const block = document.createElement("div");
    block.className = "code-block fillblank-block";
    block.dataset.fillblank = "1";
    block.dataset.expect = ex.expect;
    if (ex.answers) block.dataset.answers = JSON.stringify(ex.answers);
    block.innerHTML = `
      <div class="fillblank-meta">
        <strong>${escapeHtml(ex.title)}</strong>
        ${ex.hint ? `<span class="fillblank-hint">${escapeHtml(ex.hint)}</span>` : ""}
      </div>
      <div class="code-header">
        <span class="code-lang">${escapeHtml(ex.lang)}</span>
      </div>
      <pre><code>${escapeHtml(ex.template)}</code></pre>`;
    wrap.appendChild(block);
  });

  quizEl.parentNode.insertBefore(wrap, quizEl);
  panel.dataset.fillblanksInjected = "1";
}

window.injectFillBlankSection = injectFillBlankSection;

const EXERCISE_STORAGE_KEY = "cf_exercises";

function loadExerciseStore() {
  try {
    return JSON.parse(localStorage.getItem(EXERCISE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveExerciseStore(store) {
  try {
    localStorage.setItem(EXERCISE_STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota */
  }
}

function findExerciseById(id) {
  if (typeof exerciseData === "undefined" || !id) return null;
  for (const list of Object.values(exerciseData)) {
    const found = list.find((ex) => ex.id === id);
    if (found) return found;
  }
  return null;
}

function injectWriteExercises(tabId, panel) {
  if (!panel || panel.dataset.exercisesInjected === "1") return;
  if (typeof exerciseData === "undefined" || !exerciseData[tabId]?.length) return;

  const quizEl =
    panel.querySelector(`#${tabId}-quiz`) ||
    panel.querySelector(".quiz-section");
  if (!quizEl) return;

  const store = loadExerciseStore();
  const wrap = document.createElement("section");
  wrap.className = "write-exercise-section";
  wrap.setAttribute("aria-label", "コードを書くドリル");
  wrap.innerHTML = `<div class="quiz-header"><h3>✍️ コードを書くドリル</h3></div>
    <p class="quiz-intro">関数を自分で実装し、「判定する」でテスト出力と照合します。下書きは端末に保存されます。</p>`;

  exerciseData[tabId].forEach((ex, index) => {
    const saved = store[ex.id] || {};
    const code = typeof saved.code === "string" ? saved.code : ex.starter;
    const passed = !!saved.passed;
    const card = document.createElement("article");
    card.className = `write-exercise${passed ? " is-passed" : ""}`;
    card.dataset.exerciseId = ex.id;
    card.innerHTML = `
      <div class="write-exercise-header">
        <span class="write-exercise-num">${String(index + 1).padStart(2, "0")}</span>
        <div class="write-exercise-titles">
          <h4>${escapeHtml(ex.title)}</h4>
          <p class="write-exercise-prompt">${escapeHtml(ex.prompt)}</p>
          ${ex.hint ? `<p class="write-exercise-hint">ヒント: ${escapeHtml(ex.hint)}</p>` : ""}
        </div>
        <span class="write-exercise-badge"${passed ? "" : " hidden"}>クリア</span>
      </div>
      <label class="write-exercise-label" for="ex-editor-${escapeHtml(ex.id)}">
        <span class="code-lang">${escapeHtml(ex.lang)}</span>
      </label>
      <textarea id="ex-editor-${escapeHtml(ex.id)}" class="write-exercise-editor"
        spellcheck="false" autocomplete="off" aria-label="${escapeHtml(ex.title)} のコード"></textarea>
      <div class="write-exercise-actions">
        <button type="button" class="write-exercise-run">▶ 判定する</button>
        <button type="button" class="write-exercise-reset">リセット</button>
      </div>
      <pre class="code-run-output write-exercise-output" hidden></pre>`;
    const editor = card.querySelector(".write-exercise-editor");
    if (editor) editor.value = code;
    wrap.appendChild(card);
  });

  quizEl.parentNode.insertBefore(wrap, quizEl);
  panel.dataset.exercisesInjected = "1";
}

window.injectWriteExercises = injectWriteExercises;

function bindWriteExercises(root) {
  if (!root) return;
  root.querySelectorAll(".write-exercise").forEach((card) => {
    if (card.dataset.bound === "1") return;
    card.dataset.bound = "1";

    const editor = card.querySelector(".write-exercise-editor");
    const runBtn = card.querySelector(".write-exercise-run");
    const resetBtn = card.querySelector(".write-exercise-reset");
    const output = card.querySelector(".write-exercise-output");
    const badge = card.querySelector(".write-exercise-badge");
    const id = card.dataset.exerciseId;

    const persist = (patch) => {
      const store = loadExerciseStore();
      store[id] = { ...(store[id] || {}), ...patch };
      saveExerciseStore(store);
    };

    editor?.addEventListener("change", () => {
      persist({ code: editor.value });
    });
    editor?.addEventListener("blur", () => {
      persist({ code: editor.value });
    });

    resetBtn?.addEventListener("click", () => {
      const ex = findExerciseById(id);
      editor.value = ex?.starter || "";
      persist({ code: editor.value, passed: false });
      card.classList.remove("is-passed");
      if (badge) badge.hidden = true;
      if (output) {
        output.hidden = true;
        output.textContent = "";
        output.className = "code-run-output write-exercise-output";
      }
    });

    runBtn?.addEventListener("click", () => runWriteExercise(card, runBtn));
  });
}

window.bindWriteExercises = bindWriteExercises;

async function runWriteExercise(card, btn) {
  const editor = card.querySelector(".write-exercise-editor");
  const output = card.querySelector(".write-exercise-output");
  const badge = card.querySelector(".write-exercise-badge");
  const ex = findExerciseById(card.dataset.exerciseId);
  if (!editor || !output || !ex) return;

  const lang = detectRunnableLang(ex.lang || "");
  if (!lang) {
    output.hidden = false;
    output.className = "code-run-output error write-exercise-output";
    output.textContent = "この言語はブラウザ内で実行できません。";
    return;
  }

  const userCode = editor.value;
  const code = `${userCode}\n${ex.tests || ""}`;
  const expect = ex.expect || "";

  output.hidden = false;
  output.textContent = "実行中…";
  output.className = "code-run-output running write-exercise-output";
  btn.disabled = true;

  try {
    const result =
      lang === "js" ? await runJsSandbox(code) : await runPython(code, output);
    const text = result === "" ? "(出力なし)" : result;
    const ok = normalizeRunOutput(result) === normalizeRunOutput(expect);
    output.className = ok
      ? "code-run-output done fillblank-pass write-exercise-output"
      : "code-run-output error fillblank-fail write-exercise-output";
    output.textContent = ok
      ? `✅ クリア\n${text}`
      : `❌ 不一致\n出力:\n${text}\n\n期待:\n${expect}`;

    const store = loadExerciseStore();
    store[card.dataset.exerciseId] = {
      ...(store[card.dataset.exerciseId] || {}),
      code: userCode,
      passed: ok,
    };
    saveExerciseStore(store);
    card.classList.toggle("is-passed", ok);
    if (badge) badge.hidden = !ok;
  } catch (err) {
    output.className = "code-run-output error write-exercise-output";
    output.textContent = String(err.message || err);
    card.classList.remove("is-passed");
    if (badge) badge.hidden = true;
  } finally {
    btn.disabled = false;
  }
}

function prepareFillBlankBlocks(root) {
  root.querySelectorAll(".code-block").forEach((block) => {
    if (block.dataset.fillPrepared === "1") return;
    const codeEl = block.querySelector("code");
    if (!codeEl) return;
    const raw = codeEl.textContent;
    if (!raw.includes("___")) return;

    const parts = raw.split("___");
    codeEl.replaceChildren();
    parts.forEach((part, i) => {
      codeEl.appendChild(document.createTextNode(part));
      if (i < parts.length - 1) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "code-blank";
        input.setAttribute("aria-label", `穴埋め ${i + 1}`);
        input.autocomplete = "off";
        input.spellcheck = false;
        codeEl.appendChild(input);
      }
    });
    block.dataset.fillblank = "1";
    block.dataset.fillPrepared = "1";
  });
}

function readCodeFromBlock(block) {
  const codeEl = block.querySelector("code");
  if (!codeEl) return "";
  if (block.dataset.fillblank !== "1") return codeEl.textContent ?? "";
  let out = "";
  codeEl.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) out += node.textContent;
    else if (node.classList?.contains("code-blank")) out += node.value.trim();
  });
  return out;
}

function waitUntil(predicate, intervalMs = 50) {
  return new Promise((resolve) => {
    const id = setInterval(() => {
      if (predicate()) {
        clearInterval(id);
        resolve();
      }
    }, intervalMs);
  });
}

// --------------------------------------------------
// タブナビゲーション
// --------------------------------------------------
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const indicator = document.getElementById("tab-indicator");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // カテゴリ切替ボタン（最後に開いたタブを優先）
  document.querySelectorAll(".tab-group-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.group;
      setActiveTabGroup(group);
      const remembered = lastTabByGroup[group];
      const rememberedBtn = remembered
        ? document.querySelector(
            `.tab-button[data-tab="${remembered}"][data-group="${group}"]`
          )
        : null;
      const target =
        rememberedBtn ||
        document.querySelector(`.tab-button[data-group="${group}"]`);
      if (target) switchTab(target.dataset.tab);
    });
  });

  requestAnimationFrame(() => {
    const activeBtn = document.querySelector(".tab-button.active");
    if (activeBtn && indicator) updateTabIndicator(activeBtn, indicator);
  });

  window.addEventListener("resize", () => {
    const activeBtn = document.querySelector(".tab-button.active");
    if (activeBtn && indicator) updateTabIndicator(activeBtn, indicator);
  });
}

function setActiveTabGroup(group) {
  document.querySelectorAll(".tab-group-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.group === group);
  });
  document.querySelectorAll(".tab-button").forEach((b) => {
    b.hidden = b.dataset.group !== group;
  });
  // インジケーター再配置
  requestAnimationFrame(() => {
    const activeBtn = document.querySelector(
      `.tab-button[data-group="${group}"].active`
    ) || document.querySelector(`.tab-button[data-group="${group}"]:not([hidden])`);
    const indicator = document.getElementById("tab-indicator");
    if (activeBtn && indicator) updateTabIndicator(activeBtn, indicator);
  });
}

async function switchTab(tabName) {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const indicator = document.getElementById("tab-indicator");

  // グループが異なる場合はグループも切替
  const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (targetBtn?.dataset.group) {
    setActiveTabGroup(targetBtn.dataset.group);
  }

  tabButtons.forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });

  if (targetBtn) {
    targetBtn.classList.add("active");
    targetBtn.setAttribute("aria-selected", "true");
    updateTabIndicator(targetBtn, indicator);
    if (targetBtn.dataset.group) {
      lastTabByGroup[targetBtn.dataset.group] = tabName;
    }
  }

  tabContents.forEach((tc) => tc.classList.remove("active"));
  const targetContent = document.getElementById(`content-${tabName}`);
  if (targetContent) targetContent.classList.add("active");

  const root = document.documentElement;
  const theme = TABS[tabName] || TABS[DEFAULT_TAB];
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-glow", theme.glow);

  await loadTabContent(tabName);

  requestAnimationFrame(() => {
    targetContent?.querySelectorAll(".scroll-animate").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add("visible");
    });
  });
}

function updateTabIndicator(btn, indicator) {
  if (!indicator || !btn || btn.hidden) return;
  const parent = btn.parentElement;
  if (!parent) return;
  const parentRect = parent.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  indicator.style.width = `${btnRect.width}px`;
  indicator.style.left = `${btnRect.left - parentRect.left}px`;
}

// --------------------------------------------------
// セクション開閉 / コードコピー
// --------------------------------------------------
function toggleSection(headerElement) {
  const card = headerElement.closest(".lesson-card");
  if (!card) return;
  const open = card.classList.toggle("open");
  const header = card.querySelector(".lesson-header");
  if (header) header.setAttribute("aria-expanded", open ? "true" : "false");
}

function enhanceLessonHeaders(root) {
  if (!root) return;
  root.querySelectorAll(".lesson-header").forEach((header) => {
    if (header.dataset.a11yReady === "1") return;
    header.dataset.a11yReady = "1";
    header.setAttribute("role", "button");
    header.tabIndex = 0;
    const card = header.closest(".lesson-card");
    header.setAttribute(
      "aria-expanded",
      card?.classList.contains("open") ? "true" : "false"
    );
    header.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target.closest(".complete-btn")) return;
      e.preventDefault();
      toggleSection(header);
    });
  });
}

function initDisclosures() {
  const bindings = [
    {
      toggleId: "progress-detail-toggle",
      panelId: "progress-cards",
      openLabel: "トピック別の詳細を隠す",
      closedLabel: "トピック別の詳細を表示",
    },
    {
      toggleId: "roadmap-detail-toggle",
      panelId: "roadmap-track",
      openLabel: "推奨経路を隠す",
      closedLabel: "推奨経路を表示",
    },
  ];

  bindings.forEach(({ toggleId, panelId, openLabel, closedLabel }) => {
    const toggle = document.getElementById(toggleId);
    const panel = document.getElementById(panelId);
    if (!toggle || !panel) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? openLabel : closedLabel;
      panel.hidden = !open;
      panel.classList.toggle("is-collapsed", !open);
    };

    setOpen(false);
    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
  });
}

function initStickyNavCompact() {
  const nav = document.getElementById("tab-nav");
  if (!nav) return;

  const update = () => {
    // sticky が画面上端に張り付いているときだけ検索を畳む
    const stuck = nav.getBoundingClientRect().top <= 0.5;
    nav.classList.toggle("is-compact", stuck);
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function copyCode(btn) {
  const codeBlock = btn.closest(".code-block");
  const codeEl = codeBlock?.querySelector("code");
  if (!codeEl) return;
  const text = codeEl.textContent || "";

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => showCopyFeedback(btn))
      .catch(() => {
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
  btn.textContent = "✓ コピーしました！";
  btn.classList.add("copied");
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove("copied");
  }, 2000);
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

// --------------------------------------------------
// 完了トグル & 進捗
// --------------------------------------------------
function toggleComplete(sectionId) {
  const card = document.querySelector(`[data-section="${sectionId}"]`);
  const btn = card?.querySelector(".complete-btn");
  if (!card || !btn) return;

  const idx = state.completedSections.indexOf(sectionId);
  if (idx > -1) {
    state.completedSections.splice(idx, 1);
    card.classList.remove("completed");
    btn.classList.remove("completed");
  } else {
    state.completedSections.push(sectionId);
    card.classList.add("completed");
    btn.classList.add("completed");
  }

  saveProgress();
  updateAllProgress();
}

function restoreProgress() {
  state.completedSections.forEach((sectionId) => {
    const card = document.querySelector(`[data-section="${sectionId}"]`);
    if (!card) return;
    card.classList.add("completed");
    const btn = card.querySelector(".complete-btn");
    if (btn) btn.classList.add("completed");
  });
}

function saveProgress() {
  localStorage.setItem(
    STORAGE_KEYS.completed,
    JSON.stringify(state.completedSections)
  );
  localStorage.setItem(
    STORAGE_KEYS.quizAnswered,
    JSON.stringify(state.quizAnswered)
  );
}

// タブごとの完了数を state から直接数える。
// 完了IDは「タブID-連番」形式なので、^lang-\d+$ の完全一致で照合する
// （startsWith だと python-cert が python に二重計上される）。
// 分母は TABS[].lessons（静的定数）を使うため、
// 未読込のタブでも正しい進捗率が出る。
function countCompleted(lang) {
  const re = new RegExp(`^${lang}-\\d+$`);
  return state.completedSections.filter((id) => re.test(id)).length;
}

function updateAllProgress() {
  let totalSections = 0;
  let totalCompleted = 0;

  TAB_IDS.forEach((lang) => {
    const total =
      TABS[lang]?.lessons ??
      document.querySelectorAll(`#content-${lang} .lesson-card`).length;
    const completed = countCompleted(lang);

    totalSections += total;
    totalCompleted += completed;

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const bar = document.getElementById(`${lang}-progress-bar`);
    const text = document.getElementById(`${lang}-progress-text`);
    if (bar) bar.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}%`;
  });

  const overallPercent =
    totalSections > 0 ? Math.round((totalCompleted / totalSections) * 100) : 0;
  const overallBar = document.getElementById("overall-progress-bar");
  const overallText = document.getElementById("overall-progress-text");
  if (overallBar) overallBar.style.width = `${overallPercent}%`;
  if (overallText) overallText.textContent = `${overallPercent}% 完了`;

  updateRoadmapProgress();
}

// ==================================================
// 学習ロードマップ（WBS 3.1）
// ==================================================
// ROADMAP 定数から推奨経路のステッパーUIを生成する。
// 各ノードは対応タブへのリンクになっており、進捗率で
// 「未着手 / 学習中 / 完了」の3状態に色分けされる。
function renderRoadmap() {
  const container = document.getElementById("roadmap-track");
  if (!container) return;

  container.innerHTML = ROADMAP.map((step, i) => {
    const arrow =
      i < ROADMAP.length - 1 ? '<span class="roadmap-arrow">→</span>' : "";
    return `
      <button type="button" class="roadmap-node" data-roadmap-tab="${step.tab}"
              title="${escapeHtml(step.label)} へ移動">
        <span class="roadmap-step">${i + 1}</span>
        <span class="roadmap-icon">${step.icon}</span>
        <span class="roadmap-label">${escapeHtml(step.label)}</span>
        <span class="roadmap-percent" data-roadmap-percent="${step.tab}">0%</span>
      </button>${arrow}`;
  }).join("");

  container.addEventListener("click", (e) => {
    const node = e.target.closest(".roadmap-node");
    if (!node) return;
    switchTab(node.dataset.roadmapTab);
    document
      .getElementById("tab-nav")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateRoadmapProgress();
}

function updateRoadmapProgress() {
  ROADMAP.forEach(({ tab }) => {
    const node = document.querySelector(`[data-roadmap-tab="${tab}"]`);
    const label = document.querySelector(`[data-roadmap-percent="${tab}"]`);
    if (!node || !label) return;

    const total = TABS[tab]?.lessons || 0;
    const completed = countCompleted(tab);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    label.textContent = `${percent}%`;
    node.classList.toggle("done", percent === 100);
    node.classList.toggle("in-progress", percent > 0 && percent < 100);
  });
}

// --------------------------------------------------
// クイズ
// --------------------------------------------------
function initQuizForTab(lang) {
  const container = document.getElementById(`${lang}-quiz-container`);
  if (!container) return;
  if (container.dataset.initialized === "true") return;

  const questions = typeof quizData !== "undefined" ? quizData[lang] : null;
  if (!questions) return;

  container.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  questions.forEach((q, qIdx) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-question";
    questionDiv.setAttribute("data-quiz-id", `${lang}-${qIdx}`);

    let optionsHtml = "";
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

  container.dataset.initialized = "true";
  restoreQuizAnswers(lang);
}

function revealQuizAnswer(questionDiv, question, selectedIdx) {
  const allOptions = questionDiv.querySelectorAll(".quiz-option");
  allOptions.forEach((opt) => opt.classList.add("disabled"));

  if (selectedIdx === question.correct) {
    allOptions[selectedIdx]?.classList.add("correct");
  } else {
    allOptions[selectedIdx]?.classList.add("incorrect");
    allOptions[question.correct]?.classList.add("correct");
  }

  if (!questionDiv.querySelector(".quiz-explanation")) {
    const explanationDiv = document.createElement("div");
    explanationDiv.className = "quiz-explanation";
    explanationDiv.innerHTML = `💡 <strong>解説:</strong> ${escapeHtml(
      question.explanation
    )}`;
    questionDiv.appendChild(explanationDiv);
  }
}

function handleQuizAnswer(optionEl, lang, questionIdx, selectedIdx) {
  const quizId = `${lang}-${questionIdx}`;
  if (state.quizAnswered[quizId] !== undefined) return;

  const questionDiv = optionEl.closest(".quiz-question");
  revealQuizAnswer(questionDiv, quizData[lang][questionIdx], selectedIdx);

  state.quizAnswered[quizId] = selectedIdx;
  saveProgress();
  checkQuizCompletion(lang);
}

function checkQuizCompletion(lang) {
  const questions = quizData[lang];
  if (!questions) return;

  let answered = 0;
  let correct = 0;

  questions.forEach((q, idx) => {
    const quizId = `${lang}-${idx}`;
    if (state.quizAnswered[quizId] !== undefined) {
      answered++;
      if (state.quizAnswered[quizId] === q.correct) correct++;
    }
  });

  if (answered !== questions.length) return;

  const resultDiv = document.getElementById(`${lang}-quiz-result`);
  if (!resultDiv) return;

  const percent = Math.round((correct / questions.length) * 100);
  let resultClass, emoji, message;

  if (percent >= 80) {
    resultClass = "excellent";
    emoji = "🎉";
    message = `素晴らしい！${correct}/${questions.length} 問正解（${percent}%）`;
  } else if (percent >= 60) {
    resultClass = "good";
    emoji = "👍";
    message = `なかなか良い！${correct}/${questions.length} 問正解（${percent}%）`;
  } else {
    resultClass = "needs-work";
    emoji = "📚";
    message = `${correct}/${questions.length} 問正解（${percent}%）— もう一度レッスンを復習してみましょう`;
  }

  resultDiv.className = `quiz-result show ${resultClass}`;
  resultDiv.innerHTML = `${emoji} ${message}`;
}

function restoreQuizAnswers(lang) {
  const questions = quizData[lang];
  if (!questions) return;

  questions.forEach((q, qIdx) => {
    const quizId = `${lang}-${qIdx}`;
    const savedAnswer = state.quizAnswered[quizId];
    if (savedAnswer === undefined) return;

    const questionDiv = document.querySelector(`[data-quiz-id="${quizId}"]`);
    if (!questionDiv) return;
    revealQuizAnswer(questionDiv, q, savedAnswer);
  });

  checkQuizCompletion(lang);
}

// --------------------------------------------------
// パーティクル
// --------------------------------------------------
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let isVisible = true;

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  const count = Math.min(60, Math.floor(canvas.offsetWidth / 20));
  for (let i = 0; i < count; i++) particles.push(createParticle());

  function createParticle() {
    const colors = [
      "rgba(55, 118, 171, 0.4)",
      "rgba(97, 218, 251, 0.3)",
      "rgba(49, 120, 198, 0.35)",
      "rgba(255, 212, 59, 0.2)",
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
    if (isVisible) {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.speedX + Math.sin(p.phase) * 0.1;
        p.y += p.speedY + Math.cos(p.phase) * 0.05;
        p.phase += 0.005;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, "0.08)");
        ctx.fill();
      });

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
    }
    requestAnimationFrame(animate);
  }

  animate();
  document.addEventListener("visibilitychange", () => {
    isVisible = !document.hidden;
  });
}

// --------------------------------------------------
// スクロールアニメーション
// --------------------------------------------------
let scrollObserver = null;

function initScrollAnimations() {
  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document
    .querySelectorAll(".progress-overview")
    .forEach((el) => observeScrollTargets(el.parentElement || el));
}

function observeScrollTargets(root) {
  if (!scrollObserver || !root) return;
  root
    .querySelectorAll(".lesson-card, .quiz-section, .puzzle-section, .progress-overview")
    .forEach((el) => {
      el.classList.add("scroll-animate");
      scrollObserver.observe(el);
    });
}

// --------------------------------------------------
// スムーズスクロール / 進捗カード
// --------------------------------------------------
document.addEventListener("click", (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  e.preventDefault();
  const targetId = anchor.getAttribute("href").slice(1);
  const targetEl = document.getElementById(targetId);
  if (targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", (e) => {
  const card = e.target.closest(".progress-card");
  if (!card) return;
  const lang = card.dataset.lang;
  if (!lang) return;
  switchTab(lang);
  setTimeout(() => {
    const tabNav = document.getElementById("tab-nav");
    if (tabNav) tabNav.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
});

// --------------------------------------------------
// ユーティリティ
// --------------------------------------------------
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

window.toggleSection = toggleSection;
window.toggleComplete = toggleComplete;
window.copyCode = copyCode;
window.switchTab = switchTab;
window.handleQuizAnswer = handleQuizAnswer;
window.retryLoadTab = retryLoadTab;

// --------------------------------------------------
// パズル
// --------------------------------------------------
function initPuzzleDropzones() {
  // 委譲: 動的に注入されるゾーンにも効くよう document で捕捉
  document.addEventListener("dragover", (e) => {
    const zone = e.target.closest(".puzzle-source, .puzzle-dropzone");
    if (!zone) return;
    e.preventDefault();
    zone.classList.add("drag-over");

    const afterElement = getDragAfterElement(zone, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (!draggable) return;
    if (afterElement == null) zone.appendChild(draggable);
    else zone.insertBefore(draggable, afterElement);
  });

  document.addEventListener("dragleave", (e) => {
    const zone = e.target.closest(".puzzle-source, .puzzle-dropzone");
    if (zone) zone.classList.remove("drag-over");
  });

  document.addEventListener("drop", (e) => {
    const zone = e.target.closest(".puzzle-source, .puzzle-dropzone");
    if (!zone) return;
    e.preventDefault();
    zone.classList.remove("drag-over");
    const placeholder = zone.querySelector(".dropzone-placeholder");
    const pieces = zone.querySelectorAll(".puzzle-piece");
    if (placeholder) {
      placeholder.style.display = pieces.length > 0 ? "none" : "block";
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".puzzle-piece:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function loadPuzzle(lang) {
  const data = typeof puzzleData !== "undefined" ? puzzleData[lang] : null;
  if (!data) return;

  const questionEl = document.getElementById(`${lang}-puzzle-question`);
  const sourceZone = document.getElementById(`${lang}-puzzle-source`);
  const dropZone = document.getElementById(`${lang}-puzzle-dropzone`);
  const resultEl = document.getElementById(`${lang}-puzzle-result`);
  if (!questionEl || !sourceZone || !dropZone) return;

  questionEl.textContent = data.question;
  if (resultEl) {
    resultEl.innerHTML = "";
    resultEl.className = "quiz-result";
  }

  sourceZone.innerHTML = "";
  dropZone.innerHTML =
    '<div class="dropzone-placeholder">ここにドロップしてコードを完成させる</div>';

  const shuffled = [...data.pieces].sort(() => Math.random() - 0.5);

  shuffled.forEach((piece) => {
    const el = document.createElement("div");
    el.className = "puzzle-piece";
    el.draggable = true;
    el.textContent = piece.text;
    el.dataset.id = piece.id;

    el.addEventListener("dragstart", () => {
      el.classList.add("dragging");
      const placeholder = dropZone.querySelector(".dropzone-placeholder");
      if (placeholder) placeholder.style.display = "none";
    });

    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
      const placeholder = dropZone.querySelector(".dropzone-placeholder");
      const piecesInDropzone = dropZone.querySelectorAll(".puzzle-piece");
      if (placeholder) {
        placeholder.style.display =
          piecesInDropzone.length === 0 ? "block" : "none";
      }
    });

    sourceZone.appendChild(el);
  });
}

function checkPuzzle(lang) {
  const data = puzzleData[lang];
  if (!data) return;

  const dropZone = document.getElementById(`${lang}-puzzle-dropzone`);
  const resultEl = document.getElementById(`${lang}-puzzle-result`);
  if (!dropZone || !resultEl) return;

  const pieces = dropZone.querySelectorAll(".puzzle-piece");
  if (pieces.length !== data.correctOrder.length) {
    resultEl.innerHTML =
      "❌ 全てのブロックをドロップエリアに配置してください。";
    resultEl.className = "quiz-result show needs-work";
    return;
  }

  let isCorrect = true;
  pieces.forEach((piece, index) => {
    if (piece.dataset.id !== data.correctOrder[index]) {
      isCorrect = false;
      piece.classList.add("error-anim");
      setTimeout(() => piece.classList.remove("error-anim"), 500);
    } else {
      piece.classList.add("correct-anim");
      setTimeout(() => piece.classList.remove("correct-anim"), 500);
    }
  });

  if (isCorrect) {
    resultEl.innerHTML = `✅ <strong>正解！完璧です。</strong><br><br>${data.explanation}`;
    resultEl.className = "quiz-result show excellent";
  } else {
    resultEl.innerHTML =
      "❌ 順番が間違っている箇所があります。赤く揺れたブロックを見直してください。";
    resultEl.className = "quiz-result show needs-work";
  }
}

window.checkPuzzle = checkPuzzle;
window.loadPuzzle = loadPuzzle;

// ==================================================
// SQL プレイグラウンド（sql.js / WASM）
// ==================================================
// Database タブ内でブラウザ内SQLiteを起動し、SQLを実行できる。
// sql.js（約1MB）はユーザーが起動ボタンを押したときに初めて
// CDN からロードする（初期表示の速度に影響させない）。
const SQLJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2";

let sqlDb = null; // 起動後の SQLite インスタンス
let sqlModule = null; // initSqlJs の戻り値（DB再作成に使う）

// プレイグラウンドの初期データ。レッスン12のECスキーマと対応させ、
// 学んだ直後のクエリをそのまま試せるようにしている。
const SQL_SEED = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'paid'
);
CREATE TABLE order_items (
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
INSERT INTO users VALUES
  (1,'佐藤','sato@example.com'),
  (2,'鈴木','suzuki@example.com'),
  (3,'田中','tanaka@example.com');
INSERT INTO products VALUES
  (1,'キーボード',8000),(2,'マウス',3000),(3,'モニター',25000);
INSERT INTO orders VALUES
  (1,1,'paid'),(2,1,'shipped'),(3,2,'paid'),(4,3,'pending');
INSERT INTO order_items VALUES
  (1,1,1,8000),(1,2,2,3000),(2,3,1,25000),(3,2,1,3000),(4,1,1,8000);
`;

const SQL_SAMPLES = [
  "SELECT * FROM users;",
  "-- ユーザーごとの注文を JOIN で結合\nSELECT u.name, o.id AS order_id, o.status\nFROM users u\nJOIN orders o ON o.user_id = u.id;",
  "-- ユーザーごとの購入合計を集計\nSELECT u.name, SUM(i.quantity * i.unit_price) AS total\nFROM users u\nJOIN orders o ON o.user_id = u.id\nJOIN order_items i ON i.order_id = o.id\nGROUP BY u.name\nORDER BY total DESC;",
  "-- CTE: 平均より高額な注文を探す\nWITH order_totals AS (\n  SELECT order_id, SUM(quantity * unit_price) AS total\n  FROM order_items GROUP BY order_id\n)\nSELECT * FROM order_totals\nWHERE total > (SELECT AVG(total) FROM order_totals);",
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function bootSqlPlayground() {
  const root = document.getElementById("sql-playground");
  if (!root) return;
  const bootArea = root.querySelector(".sql-playground-boot");
  const ui = root.querySelector(".sql-playground-ui");
  const bootBtn = root.querySelector(".sql-boot-btn");

  if (bootBtn) {
    bootBtn.disabled = true;
    bootBtn.textContent = "読み込み中…";
  }

  try {
    if (typeof initSqlJs === "undefined") {
      await loadScript(`${SQLJS_CDN}/sql-wasm.js`);
    }
    sqlModule = await initSqlJs({
      locateFile: (file) => `${SQLJS_CDN}/${file}`,
    });
    sqlDb = new sqlModule.Database();
    sqlDb.run(SQL_SEED);

    if (bootArea) bootArea.hidden = true;
    if (ui) ui.hidden = false;

    const input = document.getElementById("sql-input");
    input?.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runSql();
      }
    });
  } catch (err) {
    if (bootBtn) {
      bootBtn.disabled = false;
      bootBtn.textContent = "▶ 読み込みに失敗しました — 再試行";
    }
    renderSqlMessage(
      `sql.js の読み込みに失敗しました（ネットワークを確認してください）: ${err.message}`,
      "error"
    );
  }
}

function runSql() {
  if (!sqlDb) return;
  const input = document.getElementById("sql-input");
  const sql = input?.value.trim();
  if (!sql) return;

  try {
    const results = sqlDb.exec(sql); // [{columns, values}] を返す
    if (results.length === 0) {
      // INSERT/UPDATE/DDL など結果セットの無い文
      renderSqlMessage(
        `OK — 実行しました（${sqlDb.getRowsModified()} 行に影響）`,
        "ok"
      );
      return;
    }
    renderSqlResults(results);
  } catch (err) {
    renderSqlMessage(`SQLエラー: ${err.message}`, "error");
  }
}

function resetSqlDb() {
  if (!sqlDb || !sqlModule) return;
  sqlDb.close();
  sqlDb = new sqlModule.Database(); // initSqlJs の再ロードは不要
  sqlDb.run(SQL_SEED);
  renderSqlMessage("DBを初期状態に戻しました。", "ok");
}

function setSqlSample(idx) {
  const input = document.getElementById("sql-input");
  if (input && SQL_SAMPLES[idx]) input.value = SQL_SAMPLES[idx];
}

function renderSqlMessage(text, kind) {
  const out = document.getElementById("sql-output");
  if (!out) return;
  out.innerHTML = `<p class="sql-message ${kind}">${escapeHtml(text)}</p>`;
}

function renderSqlResults(results) {
  const out = document.getElementById("sql-output");
  if (!out) return;
  out.innerHTML = results
    .map(({ columns, values }) => {
      const head = columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
      const rows = values
        .map(
          (row) =>
            `<tr>${row
              .map((v) => `<td>${escapeHtml(v === null ? "NULL" : String(v))}</td>`)
              .join("")}</tr>`
        )
        .join("");
      return `<div class="sql-table-wrap"><table class="sql-result-table">
        <thead><tr>${head}</tr></thead><tbody>${rows}</tbody>
      </table><p class="sql-rowcount">${values.length} 行</p></div>`;
    })
    .join("");
}

window.bootSqlPlayground = bootSqlPlayground;
window.runSql = runSql;
window.resetSqlDb = resetSqlDb;
window.setSqlSample = setSqlSample;

// ==================================================
// 全文検索（WBS 3.2）
// ==================================================
// ビルド工程を持たない静的サイトのため、検索インデックスは
// 初回フォーカス時に content/*.html を fetch して構築する
// （2回目以降はブラウザキャッシュが効くため軽い）。
// 日本語は部分一致で十分実用になるため、トークナイズは行わない。
let searchIndex = null; // [{tab, section, title, text}]
let searchIndexPromise = null;

async function buildSearchIndex() {
  if (searchIndex) return searchIndex;
  if (searchIndexPromise) return searchIndexPromise;

  searchIndexPromise = (async () => {
    const parser = new DOMParser();
    const entries = [];

    await Promise.all(
      TAB_IDS.map(async (tab) => {
        try {
          const res = await fetch(`content/${tab}.html`);
          if (!res.ok) return;
          const doc = parser.parseFromString(await res.text(), "text/html");
          doc.querySelectorAll(".lesson-card").forEach((card) => {
            const title =
              card.querySelector(".lesson-title-area h3")?.textContent ?? "";
            const body =
              card.querySelector(".lesson-body")?.textContent ?? "";
            entries.push({
              tab,
              section: card.dataset.section,
              title: title.trim(),
              // 全文を持つとメモリを食うだけなので検索用に正規化して保持
              text: body.replace(/\s+/g, " ").trim(),
            });
          });
        } catch {
          /* 個別タブの失敗は無視（他タブの検索は生かす） */
        }
      })
    );

    searchIndex = entries;
    return entries;
  })();

  return searchIndexPromise;
}

// クエリに一致するレッスンを返す。タイトル一致を本文一致より優先。
function searchLessons(query, limit = 10) {
  if (!searchIndex) return [];
  const q = query.toLowerCase();

  const scored = [];
  for (const entry of searchIndex) {
    const inTitle = entry.title.toLowerCase().includes(q);
    const textIdx = entry.text.toLowerCase().indexOf(q);
    if (!inTitle && textIdx < 0) continue;

    // 一致箇所の前後を切り出してスニペットにする
    let snippet = "";
    if (textIdx >= 0) {
      const start = Math.max(0, textIdx - 20);
      snippet =
        (start > 0 ? "…" : "") +
        entry.text.slice(start, textIdx + q.length + 40) +
        "…";
    }
    scored.push({ ...entry, snippet, score: inTitle ? 2 : 1 });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

function initSearch() {
  const input = document.getElementById("site-search-input");
  const resultsEl = document.getElementById("search-results");
  if (!input || !resultsEl) return;

  // インデックス構築は初回フォーカス時（初期表示を重くしない）
  input.addEventListener("focus", () => buildSearchIndex(), { once: true });

  let debounceId = null;
  input.addEventListener("input", () => {
    clearTimeout(debounceId);
    debounceId = setTimeout(async () => {
      const q = input.value.trim();
      if (q.length < 2) {
        resultsEl.hidden = true;
        return;
      }
      await buildSearchIndex();
      renderSearchResults(searchLessons(q), q);
    }, 150);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") resultsEl.hidden = true;
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-search")) resultsEl.hidden = true;
  });

  resultsEl.addEventListener("click", async (e) => {
    const item = e.target.closest("[data-result-section]");
    if (!item) return;
    resultsEl.hidden = true;
    input.value = "";
    await jumpToLesson(item.dataset.resultTab, item.dataset.resultSection);
  });
}

function renderSearchResults(results, query) {
  const resultsEl = document.getElementById("search-results");
  if (!resultsEl) return;

  if (results.length === 0) {
    resultsEl.innerHTML = `<p class="search-empty">「${escapeHtml(query)}」に一致するレッスンはありません</p>`;
    resultsEl.hidden = false;
    return;
  }

  resultsEl.innerHTML = results
    .map(
      (r) => `
    <button type="button" class="search-result-item"
            data-result-tab="${r.tab}" data-result-section="${r.section}">
      <span class="search-result-tab">${escapeHtml(TABS[r.tab]?.label || r.tab)}</span>
      <span class="search-result-title">${escapeHtml(r.title)}</span>
      ${r.snippet ? `<span class="search-result-snippet">${escapeHtml(r.snippet)}</span>` : ""}
    </button>`
    )
    .join("");
  resultsEl.hidden = false;
}

// 検索結果からレッスンへジャンプ:
// タブ切替（必要なら読込）→ カードを開く → スクロール → ハイライト
async function jumpToLesson(tab, sectionId) {
  await switchTab(tab);
  const card = document.querySelector(`[data-section="${sectionId}"]`);
  if (!card) return;
  card.classList.add("open");
  const header = card.querySelector(".lesson-header");
  if (header) header.setAttribute("aria-expanded", "true");
  card.scrollIntoView({ behavior: "smooth", block: "start" });
  card.classList.add("search-highlight");
  setTimeout(() => card.classList.remove("search-highlight"), 2400);
}

window.jumpToLesson = jumpToLesson;

// ==================================================
// コード実行（WBS 3.3.1 JS / 3.3.3 Python）
// ==================================================
// コードブロックの言語ラベルから実行可能なものを判定し、
// 「▶ 実行」ボタンを自動付与する。
//   - JavaScript: Web Worker サンドボックスで実行（DOMアクセス不可）
//   - Python:     Pyodide（WASM CPython）を初回実行時にCDNからロード
// 教材のコードには外部ライブラリ依存など実行不能なものも含まれるため、
// エラーは「結果」として素直に表示する方針（エラーを読む練習も学習）。
const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full";
let pyodideInstance = null;
let pyodidePromise = null;

function attachRunButtons(root) {
  root.querySelectorAll(".code-block").forEach((block) => {
    if (block.querySelector(".run-btn")) return; // 二重付与を防ぐ
    const label = block.querySelector(".code-lang")?.textContent ?? "";
    const lang = detectRunnableLang(label);
    if (!lang) return;

    const header = block.querySelector(".code-header");
    if (!header) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "run-btn";
    btn.textContent = "▶ 実行";
    btn.addEventListener("click", () => runCodeBlock(block, lang, btn));
    header.appendChild(btn);
  });
}

// 言語ラベルから実行エンジンを決める。
// 「PYTHON — Zulip」のような注釈付きラベルにも一致させる。
function detectRunnableLang(label) {
  const l = label.trim().toLowerCase();
  if (/^python(\b|$|[\s—(-])/.test(l) || /^python-cert/.test(l)) return "python";
  if (/^(javascript|js|typescript|ts)(\b|$|[\s—(-])/.test(l)) return "js";
  return null;
}

function normalizeRunOutput(s) {
  return String(s ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

async function runCodeBlock(block, lang, btn) {
  const code = readCodeFromBlock(block);
  const output = ensureRunOutput(block);
  output.textContent = "実行中…";
  output.className = "code-run-output running";
  btn.disabled = true;

  try {
    const result =
      lang === "js" ? await runJsSandbox(code) : await runPython(code, output);
    const text = result === "" ? "(出力なし)" : result;
    const expect = block.dataset.expect;
    if (expect != null && expect !== "") {
      const ok = normalizeRunOutput(result) === normalizeRunOutput(expect);
      output.className = ok
        ? "code-run-output done fillblank-pass"
        : "code-run-output error fillblank-fail";
      output.textContent = ok
        ? `✅ 正解\n${text}`
        : `❌ 期待と不一致\n出力:\n${text}\n\n期待:\n${expect}`;
    } else {
      output.className = "code-run-output done";
      output.textContent = text;
    }
  } catch (err) {
    output.className = "code-run-output error";
    output.textContent = String(err.message || err);
  } finally {
    btn.disabled = false;
  }
}

function ensureRunOutput(block) {
  let out = block.querySelector(".code-run-output");
  if (!out) {
    out = document.createElement("pre");
    out.className = "code-run-output";
    block.appendChild(out);
  }
  return out;
}

// JavaScript を Web Worker 内で実行する。
// Worker はページの DOM / localStorage に触れない隔離環境なので、
// 教材コードを安全に評価できる。console.log を捕捉して返す。
function runJsSandbox(code, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const workerSrc = `
      const logs = [];
      const fmt = (v) => {
        if (typeof v === "object" && v !== null) {
          try { return JSON.stringify(v); } catch { return String(v); }
        }
        return String(v);
      };
      console.log = (...a) => logs.push(a.map(fmt).join(" "));
      console.error = console.warn = console.info = console.log;
      self.onmessage = (e) => {
        try {
          const result = eval(e.data);
          if (result !== undefined) logs.push("=> " + fmt(result));
          self.postMessage({ ok: true, output: logs.join("\\n") });
        } catch (err) {
          self.postMessage({ ok: false, error: err.constructor.name + ": " + err.message });
        }
      };
    `;
    const blob = new Blob([workerSrc], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      reject(new Error(`タイムアウト（${timeoutMs / 1000}秒）— 無限ループの可能性があります`));
    }, timeoutMs);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      if (e.data.ok) resolve(e.data.output);
      else reject(new Error(e.data.error));
    };

    worker.postMessage(code);
  });
}

// Python を Pyodide（ブラウザ内CPython）で実行する。
// 本体（約10MB）は初回実行時のみロードし、以降は再利用する。
// input() やファイルI/O、pip外部ライブラリは動かないため、
// その場合はPythonの例外がそのまま出力欄に表示される。
async function loadPyodideOnce(statusEl) {
  if (pyodideInstance) return pyodideInstance;
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      if (statusEl) statusEl.textContent = "Python実行環境を読み込み中…（初回のみ・約10MB）";
      if (typeof loadPyodide === "undefined") {
        await loadScript(`${PYODIDE_CDN}/pyodide.js`);
      }
      pyodideInstance = await loadPyodide({ indexURL: `${PYODIDE_CDN}/` });
      return pyodideInstance;
    })();
  }
  return pyodidePromise;
}

async function runPython(code, statusEl) {
  const pyodide = await loadPyodideOnce(statusEl);
  if (statusEl) statusEl.textContent = "実行中…";

  // stdout / stderr を捕捉
  let buffer = "";
  pyodide.setStdout({ batched: (s) => (buffer += s + "\n") });
  pyodide.setStderr({ batched: (s) => (buffer += s + "\n") });

  try {
    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined && result !== null) {
      buffer += `=> ${result}`;
    }
    return buffer.trimEnd();
  } catch (err) {
    // Pythonのトレースバックは学習素材として有用なのでそのまま見せる
    throw new Error(shortenTraceback(String(err.message || err)));
  }
}

// Pyodideのトレースバックは内部フレームを含み長いので、
// 学習者に意味のある末尾部分（エラー種別と行）だけに要約する。
function shortenTraceback(tb) {
  const lines = tb.trimEnd().split("\n");
  const idx = lines.findIndex((l) => l.includes('File "<exec>"'));
  return (idx >= 0 ? lines.slice(idx) : lines.slice(-5)).join("\n");
}

// ==================================================
// 進捗エクスポート / インポート（WBS 3.4）
// ==================================================
// localStorage はブラウザ削除・端末変更で消えるため、
// JSONファイルとして書き出し / 読み込みできるようにする。
function exportProgress() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    completedSections: state.completedSections,
    quizAnswered: state.quizAnswered,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `code-foundations-progress-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data.completedSections) ||
          typeof data.quizAnswered !== "object" || data.quizAnswered === null) {
        throw new Error("形式が不正です");
      }
      state.completedSections = data.completedSections.filter(
        (id) => typeof id === "string"
      );
      state.quizAnswered = data.quizAnswered;
      saveProgress();
      // クイズUIの復元は再読み込みに任せるのが最も確実
      location.reload();
    } catch (err) {
      alert(`インポートに失敗しました: ${err.message}`);
    }
  };
  reader.readAsText(file);
}

function initProgressIO() {
  document
    .getElementById("export-progress-btn")
    ?.addEventListener("click", exportProgress);

  const fileInput = document.getElementById("import-progress-file");
  document
    .getElementById("import-progress-btn")
    ?.addEventListener("click", () => fileInput?.click());
  fileInput?.addEventListener("change", () => {
    if (fileInput.files?.[0]) importProgress(fileInput.files[0]);
  });
}

window.exportProgress = exportProgress;
// テスト・デバッグ用に実行エンジンも公開
window.runJsSandbox = runJsSandbox;
window.runPython = runPython;
