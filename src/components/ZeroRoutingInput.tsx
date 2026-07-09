import { useState, type FormEvent, type KeyboardEvent } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { ReadingLog } from "../types/reading-log";

interface ZeroRoutingInputProps {
  onLogAdded: (log: ReadingLog) => void;
}

export function ZeroRoutingInput({ onLogAdded }: ZeroRoutingInputProps) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const trimmed = title.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    setError(null);
    try {
      const log = await invoke<ReadingLog>("add_log", { title: trimmed });
      onLogAdded(log);
      setTitle("");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error("add_log failed:", err);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    void submit();
  }

  return (
    <header className="shrink-0 border-b border-[#00e5ff33] px-4 py-3">
      <form onSubmit={handleSubmit}>
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
      </form>
      {error ? <p className="mt-2 text-[#ff4d4d]">{error}</p> : null}
    </header>
  );
}
