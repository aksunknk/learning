export type ReadingStatus = "unread" | "reading" | "read";

export interface ReadingLog {
  id: string;
  isbn: string | null;
  title: string;
  author: string | null;
  status: ReadingStatus;
  resonance: boolean;
  updated_at: string;
}
