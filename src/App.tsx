import { useCallback, useEffect, useState } from "react";
import { ZeroRoutingInput } from "./components/ZeroRoutingInput";
import { TheGrid } from "./components/TheGrid";
import { inTauri, safeInvoke } from "./lib/ipc";
import type { ReadingLog } from "./types/reading-log";

function App() {
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const tauriReady = inTauri();

  const loadLogs = useCallback(async () => {
    try {
      const data = await safeInvoke<ReadingLog[]>("get_logs");
      setLogs(data);
      setRuntimeError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setRuntimeError(message);
      console.error("get_logs failed:", err);
    }
  }, []);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  function handleLogAdded(log: ReadingLog) {
    setLogs((current) => [log, ...current]);
  }

  return (
    <div className="flex h-full flex-col bg-[#020408] text-[#00e5ff]">
      {!tauriReady ? (
        <div className="border-b border-[#00e5ff33] px-4 py-2 text-[#00e5ff99]">
          ブラウザ開発モード（localStorage）。本番は{" "}
          <code className="text-[#00e5ff]">npm run tauri dev</code>{" "}
          のデスクトップウィンドウを使用してください。
        </div>
      ) : null}
      {runtimeError ? (
        <div className="border-b border-[#ff4d4d66] px-4 py-2 text-[#ff4d4d]">
          {runtimeError}
        </div>
      ) : null}
      <ZeroRoutingInput onLogAdded={handleLogAdded} enabled />
      <TheGrid logs={logs} />
    </div>
  );
}

export default App;
