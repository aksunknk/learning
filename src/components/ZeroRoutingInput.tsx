import { useState, type KeyboardEvent } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { ReadingLog } from "../types/reading-log";

interface ZeroRoutingInputProps {
  onLogAdded: (log: ReadingLog) => void;
}

export function ZeroRoutingInput({ onLogAdded }: ZeroRoutingInputProps) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const trimmed = title.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    try {
      const log = await invoke<ReadingLog>("add_log", { title: trimmed });
      onLogAdded(log);
      setTitle("");
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void submit();
    }
  }

  return (
    <header className="shrink-0 border-b border-[#00e5ff33] px-4 py-3">
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="> title"
        disabled={busy}
        className="w-full bg-transparent text-[#00e5ff] placeholder:text-[#00e5ff66] caret-[#00e5ff] disabled:opacity-50"
        autoFocus
      />
    </header>
  );
}
