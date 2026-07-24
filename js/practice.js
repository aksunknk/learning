// ============================================================
// js/practice.js — 演習層（Mission / CrossRef / TaskBoard / Fill / Write / Drills）
// 依存: escapeHtml, safeParse, STORAGE_KEYS, detectRunnableLang, runJsSandbox,
//       runPython, normalizeRunOutput, ensureRunOutput, TABS, switchTab, jumpToLesson
// ============================================================
"use strict";

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


function injectFillBlankSection(tabId, panel) {
  if (!panel || panel.dataset.fillblanksInjected === "1") return;
  if (typeof fillBlankData === "undefined" || !fillBlankData[tabId]?.length) return;

  const quizEl =
    panel.querySelector(`#${tabId}-quiz`) ||
    panel.querySelector(".quiz-section");
  if (!quizEl) return;

  const wrap = document.createElement("section");
  wrap.className = "fillblank-section";
  wrap.setAttribute("aria-label", "穴埋めドリル");
  wrap.innerHTML = `<div class="quiz-header"><h3>⌨️ 穴埋めドリル</h3></div>
    <p class="quiz-intro">___ を埋めて判定します。実行可能な言語は ▶ 実行、コマンド／マークアップは ✓ 判定です。</p>`;

  fillBlankData[tabId].forEach((ex) => {
    const block = document.createElement("div");
    block.className = "code-block fillblank-block";
    block.dataset.fillblank = "1";
    const runnable = !!detectRunnableLang(ex.lang || "");
    const checkMode =
      ex.mode === "answers" || (!runnable && ex.answers) ? "answers" : "run";
    block.dataset.checkMode = checkMode;
    if (ex.expect != null) block.dataset.expect = ex.expect;
    if (ex.answers) block.dataset.answers = JSON.stringify(ex.answers);
    if (ex.caseInsensitive) block.dataset.caseInsensitive = "1";
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

function listAllExercises() {
  if (typeof exerciseData === "undefined") return [];
  const out = [];
  Object.entries(exerciseData).forEach(([chapter, list]) => {
    list.forEach((ex) => out.push({ ...ex, chapter: ex.chapter || chapter }));
  });
  return out;
}

function exerciseLangKey(lang) {
  const l = String(lang || "").toLowerCase();
  if (l.startsWith("python")) return "python";
  if (l.startsWith("type")) return "typescript";
  if (l.startsWith("java") || l === "js") return "javascript";
  return l || "other";
}

function injectWriteExercises(tabId, panel) {
  if (!panel || panel.dataset.exercisesInjected === "1") return;
  if (tabId === "drills") return;
  if (typeof exerciseData === "undefined" || !exerciseData[tabId]?.length) return;

  const quizEl =
    panel.querySelector(`#${tabId}-quiz`) ||
    panel.querySelector(".quiz-section");
  if (!quizEl) return;

  const all = exerciseData[tabId];
  const featured = all.filter((ex) => ex.featured).slice(0, 2);
  const teaser = featured.length ? featured : all.slice(0, 2);
  const store = loadExerciseStore();
  const cleared = all.filter((ex) => store[ex.id]?.passed).length;

  const wrap = document.createElement("section");
  wrap.className = "write-exercise-section write-exercise-teaser";
  wrap.setAttribute("aria-label", "コードを書くドリル");
  wrap.innerHTML = `
    <div class="quiz-header"><h3>✍️ コードを書くドリル</h3></div>
    <p class="quiz-intro">
      この章の演習は <strong>コーディング演習</strong> ハブが正本です（全 ${all.length} 問 / クリア ${cleared}）。
      下は代表 ${teaser.length} 問です。
    </p>
    <p class="write-exercise-hub-actions">
      <button type="button" class="cross-ref-link write-exercise-hub-btn"
        data-drills-chapter="${escapeHtml(tabId)}">
        演習ハブでこの章の問題をすべて開く
        <span class="cross-ref-id">${all.length} 問</span>
      </button>
    </p>`;

  teaser.forEach((ex, index) => {
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
        <button type="button" class="write-exercise-open-hub" data-exercise-id="${escapeHtml(ex.id)}">ハブで開く</button>
      </div>
      <pre class="code-run-output write-exercise-output" hidden></pre>`;
    const editor = card.querySelector(".write-exercise-editor");
    if (editor) editor.value = code;
    wrap.appendChild(card);
  });

  wrap.querySelector(".write-exercise-hub-btn")?.addEventListener("click", () => {
    openDrillsHub(tabId);
  });
  wrap.querySelectorAll(".write-exercise-open-hub").forEach((btn) => {
    btn.addEventListener("click", () => openDrillsHub(tabId, btn.dataset.exerciseId));
  });

  quizEl.parentNode.insertBefore(wrap, quizEl);
  panel.dataset.exercisesInjected = "1";
}


const drillsState = {
  chapter: "all",
  lang: "all",
  difficulty: "all",
  status: "all",
  view: "list",
  exerciseId: null,
};

function initDrillsHub(panel, opts = {}) {
  const mount = panel?.querySelector("#drills-app");
  if (!mount) return;

  if (opts.chapter) drillsState.chapter = opts.chapter;
  if (opts.exerciseId) {
    drillsState.view = "detail";
    drillsState.exerciseId = opts.exerciseId;
    const ex = findExerciseById(opts.exerciseId);
    if (ex?.chapter) drillsState.chapter = ex.chapter;
  } else {
    drillsState.view = "list";
    drillsState.exerciseId = null;
  }

  renderDrillsApp(mount);
}

async function openDrillsHub(chapter, exerciseId) {
  await switchTab("drills");
  const panel = document.getElementById("content-drills");
  if (!panel) return;
  initDrillsHub(panel, {
    chapter: chapter || "all",
    exerciseId: exerciseId || null,
    view: exerciseId ? "detail" : "list",
  });
  panel.querySelector("#drills-app")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.openDrillsHub = openDrillsHub;

function filterDrillsList() {
  const store = loadExerciseStore();
  return listAllExercises().filter((ex) => {
    if (drillsState.chapter !== "all" && ex.chapter !== drillsState.chapter) return false;
    if (drillsState.lang !== "all" && exerciseLangKey(ex.lang) !== drillsState.lang) return false;
    if (drillsState.difficulty !== "all" && ex.difficulty !== drillsState.difficulty) return false;
    const passed = !!store[ex.id]?.passed;
    if (drillsState.status === "open" && passed) return false;
    if (drillsState.status === "cleared" && !passed) return false;
    return true;
  });
}

function renderDrillsApp(mount) {
  if (!mount) return;
  const store = loadExerciseStore();
  const all = listAllExercises();
  const clearedTotal = all.filter((ex) => store[ex.id]?.passed).length;
  const chapters = Object.keys(exerciseData || {});

  if (drillsState.view === "detail" && drillsState.exerciseId) {
    const ex = findExerciseById(drillsState.exerciseId);
    if (!ex) {
      drillsState.view = "list";
      drillsState.exerciseId = null;
    } else {
      const saved = store[ex.id] || {};
      const code = typeof saved.code === "string" ? saved.code : ex.starter;
      const passed = !!saved.passed;
      const chapterLabel = TABS[ex.chapter]?.label || ex.chapter;
      mount.innerHTML = `
        <div class="drills-toolbar">
          <button type="button" class="drills-back-btn">← 一覧へ</button>
          <span class="drills-progress">${clearedTotal} / ${all.length} クリア</span>
        </div>
        <article class="write-exercise drills-detail${passed ? " is-passed" : ""}" data-exercise-id="${escapeHtml(ex.id)}">
          <div class="write-exercise-header">
            <span class="write-exercise-num">Q</span>
            <div class="write-exercise-titles">
              <h4>${escapeHtml(ex.title)}</h4>
              <p class="write-exercise-prompt">${escapeHtml(ex.prompt)}</p>
              ${ex.hint ? `<p class="write-exercise-hint">ヒント: ${escapeHtml(ex.hint)}</p>` : ""}
              <p class="drills-meta">
                <span>${escapeHtml(chapterLabel)}</span>
                · <span>${escapeHtml(ex.lang)}</span>
                · <span>${escapeHtml(ex.difficulty || "")}</span>
              </p>
            </div>
            <span class="write-exercise-badge"${passed ? "" : " hidden"}>クリア</span>
          </div>
          <label class="write-exercise-label" for="drills-editor-${escapeHtml(ex.id)}">
            <span class="code-lang">${escapeHtml(ex.lang)}</span>
          </label>
          <textarea id="drills-editor-${escapeHtml(ex.id)}" class="write-exercise-editor"
            spellcheck="false" autocomplete="off" aria-label="${escapeHtml(ex.title)} のコード"></textarea>
          <div class="write-exercise-actions">
            <button type="button" class="write-exercise-run">▶ 判定する</button>
            <button type="button" class="write-exercise-reset">リセット</button>
            ${
              ex.lesson
                ? `<button type="button" class="cross-ref-link drills-lesson-btn"
                    data-lesson-tab="${escapeHtml(ex.chapter)}"
                    data-lesson-section="${escapeHtml(ex.lesson)}">関連レッスン ${escapeHtml(ex.lesson)}</button>`
                : ""
            }
          </div>
          <pre class="code-run-output write-exercise-output" hidden></pre>
        </article>`;
      const editor = mount.querySelector(".write-exercise-editor");
      if (editor) editor.value = code;
      mount.querySelector(".drills-back-btn")?.addEventListener("click", () => {
        drillsState.view = "list";
        drillsState.exerciseId = null;
        renderDrillsApp(mount);
      });
      mount.querySelector(".drills-lesson-btn")?.addEventListener("click", (e) => {
        const btn = e.currentTarget;
        jumpToLesson(btn.dataset.lessonTab, btn.dataset.lessonSection);
      });
      bindWriteExercises(mount);
      return;
    }
  }

  const filtered = filterDrillsList();
  const chapterOptions = chapters
    .map(
      (c) =>
        `<option value="${escapeHtml(c)}"${drillsState.chapter === c ? " selected" : ""}>${escapeHtml(
          TABS[c]?.label || c
        )}</option>`
    )
    .join("");

  mount.innerHTML = `
    <div class="drills-toolbar">
      <div class="drills-filters">
        <label>章
          <select data-drill-filter="chapter">
            <option value="all"${drillsState.chapter === "all" ? " selected" : ""}>すべて</option>
            ${chapterOptions}
          </select>
        </label>
        <label>言語
          <select data-drill-filter="lang">
            <option value="all"${drillsState.lang === "all" ? " selected" : ""}>すべて</option>
            <option value="javascript"${drillsState.lang === "javascript" ? " selected" : ""}>JavaScript</option>
            <option value="python"${drillsState.lang === "python" ? " selected" : ""}>Python</option>
            <option value="typescript"${drillsState.lang === "typescript" ? " selected" : ""}>TypeScript</option>
          </select>
        </label>
        <label>難易度
          <select data-drill-filter="difficulty">
            <option value="all"${drillsState.difficulty === "all" ? " selected" : ""}>すべて</option>
            <option value="beginner"${drillsState.difficulty === "beginner" ? " selected" : ""}>初級</option>
            <option value="intermediate"${drillsState.difficulty === "intermediate" ? " selected" : ""}>中級</option>
            <option value="advanced"${drillsState.difficulty === "advanced" ? " selected" : ""}>上級</option>
          </select>
        </label>
        <label>状態
          <select data-drill-filter="status">
            <option value="all"${drillsState.status === "all" ? " selected" : ""}>すべて</option>
            <option value="open"${drillsState.status === "open" ? " selected" : ""}>未クリア</option>
            <option value="cleared"${drillsState.status === "cleared" ? " selected" : ""}>クリア済み</option>
          </select>
        </label>
      </div>
      <span class="drills-progress">${clearedTotal} / ${all.length} クリア · 表示 ${filtered.length}</span>
    </div>
    <div class="drills-list">
      ${
        filtered.length
          ? filtered
              .map((ex) => {
                const passed = !!store[ex.id]?.passed;
                return `<button type="button" class="drills-list-item${passed ? " is-passed" : ""}" data-exercise-id="${escapeHtml(ex.id)}">
                  <span class="drills-list-title">${escapeHtml(ex.title)}</span>
                  <span class="drills-list-meta">${escapeHtml(TABS[ex.chapter]?.label || ex.chapter)} · ${escapeHtml(ex.lang)} · ${escapeHtml(ex.difficulty || "")}</span>
                  <span class="drills-list-badge">${passed ? "クリア" : "未"}</span>
                </button>`;
              })
              .join("")
          : `<p class="drills-empty">条件に合う問題がありません。</p>`
      }
    </div>`;

  mount.querySelectorAll("[data-drill-filter]").forEach((sel) => {
    sel.addEventListener("change", () => {
      drillsState[sel.dataset.drillFilter] = sel.value;
      renderDrillsApp(mount);
    });
  });
  mount.querySelectorAll(".drills-list-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      drillsState.view = "detail";
      drillsState.exerciseId = btn.dataset.exerciseId;
      renderDrillsApp(mount);
    });
  });
}

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

function readFillBlankValues(block) {
  const values = [];
  block.querySelectorAll(".code-blank").forEach((input) => {
    values.push(String(input.value ?? "").trim());
  });
  return values;
}

function checkFillBlankAnswers(block, btn) {
  const output = ensureRunOutput(block);
  let expected;
  try {
    expected = JSON.parse(block.dataset.answers || "[]");
  } catch {
    expected = [];
  }
  const got = readFillBlankValues(block);
  const insensitive = block.dataset.caseInsensitive === "1";
  const norm = (s) => {
    const t = String(s ?? "").trim();
    return insensitive ? t.toLowerCase() : t;
  };
  const ok =
    Array.isArray(expected) &&
    expected.length === got.length &&
    expected.every((ans, i) => {
      if (Array.isArray(ans)) return ans.map(norm).includes(norm(got[i]));
      return norm(ans) === norm(got[i]);
    });

  output.className = ok
    ? "code-run-output done fillblank-pass"
    : "code-run-output error fillblank-fail";
  output.textContent = ok
    ? `✅ 正解\n${got.join(" · ") || "(空)"}`
    : `❌ 不一致\n入力: ${got.join(" · ") || "(空)"}\nヒントを確認して再入力してください。`;
  if (btn) btn.disabled = false;
}
