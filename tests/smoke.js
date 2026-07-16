#!/usr/bin/env node
/**
 * tests/smoke.js — 静的サイトのスモークテスト
 *
 * ローカル HTTP サーバーを立て、Chromium で
 * - 初期タブの遅延読込
 * - 全タブのコンテンツ / クイズ / パズル生成
 * - カテゴリ切替
 * - 進捗の二重計上防止
 * を検証する。
 */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8765;
const BASE = `http://127.0.0.1:${PORT}`;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      let filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);
      if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/usr/local/bin/google-chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error("Chrome/Chromium executable not found");
}

async function main() {
  const server = await startServer();
  let puppeteer;
  try {
    puppeteer = require("puppeteer-core");
  } catch {
    console.error("puppeteer-core is not installed. Run: npm install");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    // ブラウザが自動要求する favicon 等の 404 は無視
    if (/Failed to load resource.*404/.test(text)) return;
    errors.push("console: " + text);
  });
  page.on("response", (res) => {
    if (res.status() !== 404) return;
    const url = res.url();
    if (url.endsWith("favicon.ico")) return;
    // content/ data/ 配下の 404 は致命的
    if (url.includes("/content/") || url.includes("/data/") || url.endsWith("/app.js") || url.endsWith("/style.css")) {
      errors.push("404: " + url);
    }
  });

  await page.goto(BASE + "/", { waitUntil: "networkidle0", timeout: 60000 });

  // 初期タブ（htmlcss）の読込完了を待つ
  await page.waitForFunction(
    () => document.querySelectorAll("#content-htmlcss .lesson-card").length > 0,
    { timeout: 15000 }
  );

  const tabs = await page.evaluate(() =>
    [...document.querySelectorAll(".tab-button")].map((b) => b.dataset.tab)
  );

  const results = { tabs: {}, groups: {}, accents: {} };

  for (const tab of tabs) {
    await page.evaluate((name) => window.switchTab(name), tab);
    await page.waitForFunction(
      (name) => {
        const panel = document.getElementById(`content-${name}`);
        return (
          panel &&
          panel.dataset.contentSrc &&
          panel.querySelectorAll(".lesson-card").length > 0
        );
      },
      { timeout: 20000 },
      tab
    );

    results.tabs[tab] = await page.evaluate((name) => {
      const panel = document.getElementById(`content-${name}`);
      return {
        lessons: panel.querySelectorAll(".lesson-card").length,
        quizQuestions: panel.querySelectorAll(".quiz-question").length,
        puzzlePieces: panel.querySelectorAll(
          `#${name}-puzzle-source .puzzle-piece`
        ).length,
      };
    }, tab);

    results.accents[tab] = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--accent")
    );
  }

  // カテゴリ切替で表示タブ数が変わること
  for (const group of ["basics", "backend", "frontend", "practice"]) {
    results.groups[group] = await page.evaluate((g) => {
      document.querySelector(`.tab-group-btn[data-group="${g}"]`).click();
      return [...document.querySelectorAll(".tab-button:not([hidden])")].map(
        (b) => b.dataset.tab
      );
    }, group);
  }

  // 進捗二重計上チェック（python-cert 完了が python に混入しない）
  await page.evaluate(() => window.switchTab("python-cert"));
  await page.waitForFunction(
    () => document.querySelectorAll("#content-python-cert .lesson-card").length > 0,
    { timeout: 15000 }
  );
  await page.evaluate(() => {
    const card = document.querySelector(
      '#content-python-cert [data-section^="python-cert"]'
    );
    if (card) window.toggleComplete(card.dataset.section);
  });
  // python も読込して進捗テキスト確認
  await page.evaluate(() => window.switchTab("python"));
  await page.waitForFunction(
    () => document.querySelectorAll("#content-python .lesson-card").length > 0,
    { timeout: 15000 }
  );
  results.progress = await page.evaluate(() => ({
    python: document.getElementById("python-progress-text")?.textContent,
    cert: document.getElementById("python-cert-progress-text")?.textContent,
  }));

  await browser.close();
  server.close();

  // Assertions
  const failures = [];
  if (tabs.length !== 12) failures.push(`expected 12 tabs, got ${tabs.length}`);

  for (const [tab, info] of Object.entries(results.tabs)) {
    if (info.lessons < 1) failures.push(`${tab}: no lessons`);
    if (info.quizQuestions < 1) failures.push(`${tab}: no quiz questions`);
    if (info.puzzlePieces < 1) failures.push(`${tab}: no puzzle pieces`);
  }

  if ((results.groups.basics || []).length < 2)
    failures.push("basics group too small");
  if (!(results.groups.backend || []).includes("docker"))
    failures.push("backend group missing docker");
  if (!(results.groups.frontend || []).includes("react"))
    failures.push("frontend group missing react");

  if (results.progress.python !== "0%")
    failures.push(
      `python progress should stay 0% after cert complete, got ${results.progress.python}`
    );
  if (results.progress.cert === "0%")
    failures.push("python-cert progress should increase after complete");

  if (errors.length) failures.push(...errors);

  console.log(JSON.stringify(results, null, 2));

  if (failures.length) {
    console.error("\nSMOKE TEST FAILED:");
    failures.forEach((f) => console.error(" -", f));
    process.exit(1);
  }

  console.log("\nSMOKE TEST PASSED");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
