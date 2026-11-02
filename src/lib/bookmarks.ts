const STORAGE_KEY = 'phatsss-bookmarks';

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isBookmarked(permalink: string): boolean {
  return getBookmarks().includes(permalink);
}

export function toggleBookmark(permalink: string): boolean {
  const current = getBookmarks();
  const exists = current.includes(permalink);
  const next = exists
    ? current.filter((p) => p !== permalink)
    : [...current, permalink];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
  return !exists;
}
