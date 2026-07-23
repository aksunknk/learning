// ============================================================
// js/runner.js — コード実行（JS Worker / Pyodide）と ▶ 実行ボタン
// 依存: loadScript, readCodeFromBlock, checkFillBlankAnswers
// ============================================================
"use strict";

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
    if (block.querySelector(".run-btn, .check-btn")) return; // 二重付与を防ぐ
    const header = block.querySelector(".code-header");
    if (!header) return;

    // 穴埋め（非実行）: answers との照合
    if (
      block.dataset.fillblank === "1" &&
      block.dataset.checkMode === "answers" &&
      block.dataset.answers
    ) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "run-btn check-btn";
      btn.textContent = "✓ 判定";
      btn.addEventListener("click", () => checkFillBlankAnswers(block, btn));
      header.appendChild(btn);
      return;
    }

    const label = block.querySelector(".code-lang")?.textContent ?? "";
    const lang = detectRunnableLang(label);
    if (!lang) return;

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

// テスト・デバッグ用
window.runJsSandbox = runJsSandbox;
window.runPython = runPython;
