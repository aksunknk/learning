import { invoke, isTauri } from "@tauri-apps/api/core";

export function inTauri(): boolean {
  return isTauri();
}

export async function safeInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>,
): Promise<T> {
  if (!isTauri()) {
    throw new Error(
      "Tauri ランタイム外です。ブラウザではなく `npm run tauri dev` で起動した Lemma Desktop ウィンドウを使用してください。",
    );
  }
  return invoke<T>(cmd, args);
}
