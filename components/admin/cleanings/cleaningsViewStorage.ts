const VIEW_MODE_KEY = 'ephtopia-cleanings-view-mode';
let viewModeListeners: Array<() => void> = [];

export function subscribeCleaningsViewMode(callback: () => void) {
  viewModeListeners = [...viewModeListeners, callback];
  const onStorage = (e: StorageEvent) => {
    if (e.key === VIEW_MODE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    viewModeListeners = viewModeListeners.filter((l) => l !== callback);
    window.removeEventListener('storage', onStorage);
  };
}

export function getCleaningsViewModeSnapshot(): 'table' | 'grid' {
  try {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    return saved === 'table' || saved === 'grid' ? saved : 'table';
  } catch {
    return 'table';
  }
}

export function getCleaningsViewModeServerSnapshot(): 'table' | 'grid' {
  return 'table';
}

export function persistCleaningsViewMode(mode: 'table' | 'grid') {
  try {
    localStorage.setItem(VIEW_MODE_KEY, mode);
    viewModeListeners.forEach((l) => l());
  } catch {
    // Ignore storage errors
  }
}

