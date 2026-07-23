// ============================================================
// js/utils.js — 共有ユーティリティ（バンドラなし・グローバル関数）
// ============================================================
"use strict";

const STORAGE_KEYS = {
  completed: "cf_completed",
  quizAnswered: "cf_quizAnswered",
  missions: "cf_missions",
  rubrics: "cf_rubrics",
};

function safeParse(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
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

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}
