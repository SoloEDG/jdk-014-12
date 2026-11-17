import type {
  ComicDocument,
  Bookmark,
  ReadingLocation,
  ReadingMode,
} from "../../../shared/document";
const KEY = "panel-jdk014-v1";
export interface SavedSession {
  document: ComicDocument;
  location: ReadingLocation;
  bookmarks: Bookmark[];
  mode: ReadingMode;
}
function readMode(value: unknown): ReadingMode {
  return value === "panel" || value === "page" ? value : "page";
}
export function readSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<SavedSession> | null;
    if (
      !value ||
      value.document?.version !== 1 ||
      !Array.isArray(value.document.chapters) ||
      !value.document.chapters.length ||
      !value.location ||
      !Array.isArray(value.bookmarks)
    )
      return null;
    for (const c of value.document.chapters) {
      if (!c.pages?.length) return null;
      for (const p of c.pages)
        if (!p.panels?.length || typeof p.image !== "string") return null;
    }
    return {
      document: value.document,
      location: value.location,
      bookmarks: value.bookmarks,
      mode: readMode(value.mode),
    };
  } catch {
    return null;
  }
}
export function writeSession(value: SavedSession): string {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
    return "已保存到此浏览器";
  } catch {
    return "存储空间不足，本次修改仅保留在当前页面；请减少导入图片";
  }
}
