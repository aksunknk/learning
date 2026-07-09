import type { ReadingLog } from "../types/reading-log";

interface TheGridProps {
  logs: ReadingLog[];
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ja-JP", { hour12: false });
}

export function TheGrid({ logs }: TheGridProps) {
  return (
    <section className="min-h-0 flex-1 overflow-auto px-4 py-2">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#00e5ff33] text-[#00e5ff99]">
            <th className="py-2 pr-4 font-normal">title</th>
            <th className="py-2 pr-4 font-normal">author</th>
            <th className="py-2 pr-4 font-normal">status</th>
            <th className="py-2 pr-4 font-normal">resonance</th>
            <th className="py-2 font-normal">updated</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-[#00e5ff66]">
                no entries
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="border-b border-[#00e5ff1a]">
                <td className="py-2 pr-4">{log.title}</td>
                <td className="py-2 pr-4 text-[#00e5ff99]">{log.author ?? "—"}</td>
                <td className="py-2 pr-4">{log.status}</td>
                <td className="py-2 pr-4">{log.resonance ? "1" : "0"}</td>
                <td className="py-2 text-[#00e5ff99]">{formatTimestamp(log.updated_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
