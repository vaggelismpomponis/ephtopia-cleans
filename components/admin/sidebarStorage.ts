const SIDEBAR_STORAGE_KEY = 'ephtopia-sidebar-groups';

export const DEFAULT_OPEN_GROUPS: Record<string, boolean> = {
  'Καθαρισμοί': true,
  'Λειτουργίες': true,
  'Περιεχόμενο CMS': false,
};

let sidebarListeners: Array<() => void> = [];
let cachedRawGroups: string | null | undefined;
let cachedParsedGroups: Record<string, boolean> = DEFAULT_OPEN_GROUPS;

export function subscribeSidebarGroups(callback: () => void) {
  sidebarListeners = [...sidebarListeners, callback];
  const onStorage = (e: StorageEvent) => {
    if (e.key === SIDEBAR_STORAGE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    sidebarListeners = sidebarListeners.filter((l) => l !== callback);
    window.removeEventListener('storage', onStorage);
  };
}

export function getSidebarGroupsSnapshot(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (raw === cachedRawGroups) return cachedParsedGroups;
    cachedRawGroups = raw;
    cachedParsedGroups = raw
      ? { ...DEFAULT_OPEN_GROUPS, ...(JSON.parse(raw) as Record<string, boolean>) }
      : DEFAULT_OPEN_GROUPS;
    return cachedParsedGroups;
  } catch {
    return DEFAULT_OPEN_GROUPS;
  }
}

export function getSidebarGroupsServerSnapshot(): Record<string, boolean> {
  return DEFAULT_OPEN_GROUPS;
}

export function persistSidebarGroups(next: Record<string, boolean>) {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
    sidebarListeners.forEach((l) => l());
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

