import { invoke, isTauri } from "@tauri-apps/api/core";
import type { ReadingLog } from "../types/reading-log";

const STORAGE_KEY = "lemma-reading-logs-dev";

export function inTauri(): boolean {
  return isTauri();
}

function readDevLogs(): ReadingLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReadingLog[]) : [];
  } catch {
    return [];
  }
}

function writeDevLogs(logs: ReadingLog[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function devGetLogs(): ReadingLog[] {
  return readDevLogs();
}

function devAddLog(title: string): ReadingLog {
  const log: ReadingLog = {
    id: crypto.randomUUID(),
    isbn: null,
    title,
    author: null,
    status: "unread",
    resonance: false,
    updated_at: new Date().toISOString(),
  };
  writeDevLogs([log, ...readDevLogs()]);
  return log;
}

export async function safeInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>,
): Promise<T> {
  if (!isTauri()) {
    if (cmd === "get_logs") {
      return devGetLogs() as T;
    }
    if (cmd === "add_log" && typeof args?.title === "string") {
      return devAddLog(args.title) as T;
    }
    throw new Error(`未対応のコマンド: ${cmd}`);
  }
  return invoke<T>(cmd, args);
}
