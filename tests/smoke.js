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

// app.js の TABS レジストリ（lessons）と content/*.html の実レッスン数の
// 同期を静的に検証する（進捗率の分母が狂うのを CI で防ぐ）。
function verifyLessonCounts() {
  const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
  const match = appSrc.match(/const TABS = \{([\s\S]*?)\r?\n\};/);
  if (!match) return ["TABS registry not found in app.js"];

  const declared = {};
  for (const m of match[1].matchAll(
    /["']?([\w-]+)["']?\s*:\s*\{[^\n]*?lessons:\s*(\d+)/g
  )) {
    declared[m[1]] = Number(m[2]);
  }
  if (Object.keys(declared).length === 0) {
    return ["no lesson counts parsed from TABS registry"];
  }

  const failures = [];
  for (const [tab, count] of Object.entries(declared)) {
    const file = path.join(ROOT, "content", `${tab}.html`);
    if (!fs.existsSync(file)) {
      failures.push(`content/${tab}.html missing for TABS registry entry`);
      continue;
    }
    const actual = (
      fs.readFileSync(file, "utf8").match(/class="lesson-card"/g) || []
    ).length;
    if (actual !== count) {
      failures.push(
        `TABS.${tab}.lessons = ${count} but content has ${actual} lessons`
      );
    }
  }
  return failures;
}

async function main() {
  const staticFailures = verifyLessonCounts();
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
      const hasMissionData =
        typeof missionData !== "undefined" && !!missionData[name];
      return {
        lessons: panel.querySelectorAll(".lesson-card").length,
        quizQuestions: panel.querySelectorAll(".quiz-question").length,
        puzzlePieces: panel.querySelectorAll(
          `#${name}-puzzle-source .puzzle-piece`
        ).length,
        miniMissions: panel.querySelectorAll(".mini-mission").length,
        rubric: panel.querySelectorAll(".chapter-rubric").length,
        crossRefs: panel.querySelectorAll(".cross-refs").length,
        taskboardApply: panel.querySelectorAll(".taskboard-apply").length,
        fillBlanks: panel.querySelectorAll(".code-blank").length,
        expectsPractice: hasMissionData,
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

  // SQLプレイグラウンド（databaseタブ）
  await page.evaluate(() => window.switchTab("database"));
  await page.waitForFunction(
    () => document.querySelectorAll("#content-database .lesson-card").length > 0,
    { timeout: 15000 }
  );
  results.sqlPlayground = await page.evaluate(() => ({
    bootBtn: !!document.querySelector("#sql-playground .sql-boot-btn"),
  }));
  // ネットワークが使える環境では実際に起動してクエリを実行
  try {
    await page.evaluate(() => window.bootSqlPlayground());
    await page.waitForFunction(
      () => !document.querySelector("#sql-playground .sql-playground-ui")?.hidden,
      { timeout: 30000 }
    );
    results.sqlPlayground.booted = true;
    results.sqlPlayground.queryResult = await page.evaluate(() => {
      document.getElementById("sql-input").value =
        "SELECT COUNT(*) AS n FROM users;";
      window.runSql();
      return document.querySelector("#sql-output td")?.textContent;
    });
  } catch {
    results.sqlPlayground.booted = false; // CDN不達環境ではスキップ
    console.warn("WARN: sql.js boot skipped (no network to CDN?)");
  }

  // ロードマップ（WBS 3.1）
  results.roadmap = await page.evaluate(() => ({
    nodes: document.querySelectorAll(".roadmap-node").length,
    firstTab: document.querySelector(".roadmap-node")?.dataset.roadmapTab,
  }));

  // 全文検索（WBS 3.2）
  await page.focus("#site-search-input");
  await page.type("#site-search-input", "JWT");
  await page.waitForFunction(
    () => {
      const el = document.getElementById("search-results");
      return el && !el.hidden && el.children.length > 0;
    },
    { timeout: 20000 }
  );
  results.search = await page.evaluate(() => {
    const items = [...document.querySelectorAll(".search-result-item")];
    return {
      count: items.length,
      tabs: [...new Set(items.map((i) => i.dataset.resultTab))],
    };
  });
  // 検索結果クリックで該当レッスンへジャンプ
  await page.click(".search-result-item");
  await page.waitForFunction(
    () => document.querySelector(".lesson-card.search-highlight"),
    { timeout: 20000 }
  );
  results.search.jumped = await page.evaluate(
    () => document.querySelector(".lesson-card.search-highlight")?.dataset.section
  );

  // JS サンドボックス実行（WBS 3.3.1）
  results.jsRunner = await page.evaluate(async () => {
    const out = await window.runJsSandbox?.("console.log(1 + 1); 40 + 2");
    return out;
  });

  // Python 実行ボタンの付与確認（WBS 3.3.3）
  await page.evaluate(() => window.switchTab("python"));
  await page.waitForFunction(
    () => document.querySelectorAll("#content-python .lesson-card").length > 0,
    { timeout: 15000 }
  );
  results.pyRunButtons = await page.evaluate(
    () => document.querySelectorAll("#content-python .run-btn").length
  );

  // Pyodide 実実行（ネットワーク必須・重いのでソフトチェック）
  try {
    results.pyodideOutput = await page.evaluate(async () => {
      return await window.runPython?.("print(sum(range(10)))", null);
    });
  } catch (e) {
    results.pyodideOutput = null;
    console.warn("WARN: pyodide run skipped:", e.message.slice(0, 120));
  }

  // 進捗エクスポートUI（WBS 3.4）
  results.progressIO = await page.evaluate(() => ({
    exportBtn: !!document.getElementById("export-progress-btn"),
    importBtn: !!document.getElementById("import-progress-btn"),
  }));

  // ヒーロー統計（renderShell が TABS / quizData / puzzleData から算出）
  results.heroStats = await page.evaluate(() => {
    const read = (k) =>
      document.querySelector(`[data-stat="${k}"]`)?.textContent;
    return {
      topics: read("topics"),
      lessons: read("lessons"),
      quizzes: read("quizzes"),
      puzzles: read("puzzles"),
    };
  });

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
  const failures = [...staticFailures];
  if (tabs.length !== 22) failures.push(`expected 22 tabs, got ${tabs.length}`);

  // Phase 3
  if (results.roadmap.nodes !== 18)
    failures.push(`expected 18 roadmap nodes, got ${results.roadmap.nodes}`);
  if (results.roadmap.firstTab !== "htmlcss")
    failures.push(`roadmap should start with htmlcss, got ${results.roadmap.firstTab}`);
  if (!results.search || results.search.count < 1)
    failures.push("search returned no results for 'JWT'");
  if (!results.search?.jumped)
    failures.push("search result click did not jump to a lesson");
  if (results.jsRunner !== "2\n=> 42")
    failures.push(`js sandbox expected "2\\n=> 42", got ${JSON.stringify(results.jsRunner)}`);
  if (results.pyRunButtons < 5)
    failures.push(`expected python run buttons, got ${results.pyRunButtons}`);
  if (results.pyodideOutput !== null && results.pyodideOutput !== "45")
    failures.push(`pyodide expected "45", got ${JSON.stringify(results.pyodideOutput)}`);
  if (!results.progressIO.exportBtn || !results.progressIO.importBtn)
    failures.push("progress export/import buttons missing");
  if (results.heroStats.topics !== String(tabs.length))
    failures.push(
      `hero stat topics should be ${tabs.length}, got ${results.heroStats.topics}`
    );
  if (!(Number(results.heroStats.lessons) > 0))
    failures.push(`hero stat lessons not computed: ${results.heroStats.lessons}`);
  if (!(Number(results.heroStats.quizzes) > 0))
    failures.push(`hero stat quizzes not computed: ${results.heroStats.quizzes}`);

  for (const [tab, info] of Object.entries(results.tabs)) {
    if (info.lessons < 1) failures.push(`${tab}: no lessons`);
    if (info.quizQuestions < 1) failures.push(`${tab}: no quiz questions`);
    if (info.puzzlePieces < 1) failures.push(`${tab}: no puzzle pieces`);
    if (info.expectsPractice) {
      if (info.miniMissions < 1)
        failures.push(`${tab}: missionData defined but no .mini-mission injected`);
      if (info.rubric < 1)
        failures.push(`${tab}: missionData defined but no .chapter-rubric injected`);
    }
  }
  if ((results.tabs.javascript?.miniMissions || 0) < 3) {
    failures.push(
      `javascript should inject 3 tier missions, got ${results.tabs.javascript?.miniMissions}`
    );
  }
  if ((results.tabs.testing?.miniMissions || 0) < 3) {
    failures.push(
      `testing should inject 3 tier missions, got ${results.tabs.testing?.miniMissions}`
    );
  }
  if ((results.tabs.testing?.lessons || 0) < 14) {
    failures.push(
      `testing should have 14 lessons, got ${results.tabs.testing?.lessons}`
    );
  }
  if ((results.tabs.security?.crossRefs || 0) < 1) {
    failures.push(
      `security should inject cross-refs, got ${results.tabs.security?.crossRefs}`
    );
  }
  if ((results.tabs.webapi?.crossRefs || 0) < 1) {
    failures.push(
      `webapi should inject cross-refs, got ${results.tabs.webapi?.crossRefs}`
    );
  }
  if ((results.tabs.sysdesign?.lessons || 0) < 16) {
    failures.push(
      `sysdesign should have 16 lessons, got ${results.tabs.sysdesign?.lessons}`
    );
  }
  if ((results.tabs.devtools?.lessons || 0) < 12) {
    failures.push(
      `devtools should have 12 lessons, got ${results.tabs.devtools?.lessons}`
    );
  }
  if ((results.tabs.htmlcss?.taskboardApply || 0) < 1) {
    failures.push("htmlcss should inject TaskBoard apply block");
  }
  if ((results.tabs.javascript?.fillBlanks || 0) < 1) {
    failures.push(
      `javascript should inject fill-blank inputs, got ${results.tabs.javascript?.fillBlanks}`
    );
  }
  if (!(results.groups.basics || []).includes("devtools"))
    failures.push("basics group missing devtools");
  if (!(results.groups.practice || []).includes("sysdesign"))
    failures.push("practice group missing sysdesign");

  if ((results.groups.basics || []).length < 2)
    failures.push("basics group too small");
  if (!(results.groups.basics || []).includes("git"))
    failures.push("basics group missing git");
  if (!(results.groups.backend || []).includes("docker"))
    failures.push("backend group missing docker");
  if (!(results.groups.frontend || []).includes("react"))
    failures.push("frontend group missing react");
  if (!(results.groups.practice || []).includes("capstone"))
    failures.push("practice group missing capstone");

  if (!results.sqlPlayground?.bootBtn)
    failures.push("sql playground boot button missing");
  if (
    results.sqlPlayground?.booted &&
    results.sqlPlayground.queryResult !== "3"
  )
    failures.push(
      `sql playground query expected "3", got "${results.sqlPlayground.queryResult}"`
    );

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
