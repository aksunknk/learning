// ============================================================
// app.js — Code Foundations 学習サイト（ロジック層）
//
// データは data/quizzes.js / data/puzzles.js、
// レッスン本文は content/*.html に分離済み。
// このファイルは UI 操作・進捗・遅延読込のみを担当する。
// ============================================================

"use strict";

// --------------------------------------------------
// サイト定数
// --------------------------------------------------
// 新しいタブを追加するときは、ここと content/{id}.html・
// data 側のキー・index.html のナビ／進捗カードを揃える。
const TAB_IDS = [
  "python",
  "react",
  "typescript",
  "python-cert",
  "algorithm",
  "webapi",
  "htmlcss",
  "docker",
  "database",
  "genai",
  "python-prac",
  "testing",
];

const TAB_ACCENTS = {
  python: { accent: "var(--python-blue)", glow: "rgba(55,118,171,0.35)" },
  react: { accent: "var(--react-cyan)", glow: "rgba(97,218,251,0.35)" },
  typescript: { accent: "var(--typescript-blue)", glow: "rgba(49,120,198,0.35)" },
  "python-cert": { accent: "var(--python-yellow)", glow: "rgba(255,212,59,0.35)" },
  algorithm: { accent: "var(--color-warning)", glow: "rgba(251,191,36,0.35)" },
  webapi: { accent: "var(--webapi-green)", glow: "rgba(0,191,165,0.35)" },
  htmlcss: { accent: "var(--htmlcss-orange)", glow: "rgba(227,79,38,0.35)" },
  docker: { accent: "var(--docker-blue)", glow: "rgba(36,150,237,0.35)" },
  database: { accent: "var(--database-teal)", glow: "rgba(0,150,136,0.35)" },
  genai: { accent: "var(--genai-purple)", glow: "rgba(156,39,176,0.35)" },
  "python-prac": { accent: "var(--python-blue)", glow: "rgba(55,118,171,0.35)" },
  testing: { accent: "var(--testing-green)", glow: "rgba(76,175,80,0.35)" },
};

const STORAGE_KEYS = {
  completed: "cf_completed",
  quizAnswered: "cf_quizAnswered",
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
document.addEventListener("DOMContentLoaded", async () => {
  initTabs();
  setActiveTabGroup("basics");
  initParticles();
  initScrollAnimations();
  initPuzzleDropzones();

  // 初期表示タブを先に読み込み、進捗・クイズ・パズルを有効化する
  const initial =
    document.querySelector(".tab-button.active")?.dataset.tab || "htmlcss";
  await loadTabContent(initial);

  restoreProgress();
  updateAllProgress();
});

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

    // 注入後にタブ固有のインタラクションを初期化
    initQuizForTab(tabId);
    loadPuzzle(tabId);
    observeScrollTargets(panel);
    restoreProgress();
    updateAllProgress();
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

  // カテゴリ切替ボタン
  document.querySelectorAll(".tab-group-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.group;
      setActiveTabGroup(group);
      // グループ先頭タブへ自動遷移
      const first = document.querySelector(
        `.tab-button[data-group="${group}"]`
      );
      if (first) switchTab(first.dataset.tab);
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
  }

  tabContents.forEach((tc) => tc.classList.remove("active"));
  const targetContent = document.getElementById(`content-${tabName}`);
  if (targetContent) targetContent.classList.add("active");

  const root = document.documentElement;
  const theme = TAB_ACCENTS[tabName] || TAB_ACCENTS.python;
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
  card.classList.toggle("open");
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

// 完了数は「タブ内に実在するカードの data-section」照合で数える。
// startsWith 前方一致だと python-cert が python に二重計上される。
function updateAllProgress() {
  let totalSections = 0;
  let totalCompleted = 0;

  TAB_IDS.forEach((lang) => {
    const sections = document.querySelectorAll(
      `#content-${lang} .lesson-card`
    );
    const completed = [...sections].filter((card) =>
      state.completedSections.includes(card.dataset.section)
    ).length;
    const total = sections.length;

    totalSections += total;
    totalCompleted += completed;

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const bar = document.getElementById(`${lang}-progress-bar`);
    const text = document.getElementById(`${lang}-progress-text`);
    if (bar) bar.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}%`;
  });

  // 未読込タブのレッスン数はまだ分母に入らないため、
  // 既知の総レッスン数（ヒーロー統計と同期）がある場合はそれを使う。
  const knownTotal = Number(
    document.body.dataset.totalLessons || totalSections
  );
  const denom = knownTotal > 0 ? knownTotal : totalSections;
  const overallPercent =
    denom > 0 ? Math.round((totalCompleted / denom) * 100) : 0;
  const overallBar = document.getElementById("overall-progress-bar");
  const overallText = document.getElementById("overall-progress-text");
  if (overallBar) overallBar.style.width = `${overallPercent}%`;
  if (overallText) overallText.textContent = `${overallPercent}% 完了`;
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
