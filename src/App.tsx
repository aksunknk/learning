import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ZeroRoutingInput } from "./components/ZeroRoutingInput";
import { TheGrid } from "./components/TheGrid";
import type { ReadingLog } from "./types/reading-log";

function App() {
  const [logs, setLogs] = useState<ReadingLog[]>([]);

  const loadLogs = useCallback(async () => {
    const data = await invoke<ReadingLog[]>("get_logs");
    setLogs(data);
  }, []);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  function handleLogAdded(log: ReadingLog) {
    setLogs((current) => [log, ...current]);
  }

  return (
    <div className="flex h-full flex-col bg-[#020408] text-[#00e5ff]">
      <ZeroRoutingInput onLogAdded={handleLogAdded} />
      <TheGrid logs={logs} />
    </div>
  );
}

export default App;
