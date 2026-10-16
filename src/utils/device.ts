interface NavigatorHints extends Navigator {
  deviceMemory?: number;
  connection?: {saveData?: boolean;};
}

/** Heuristic for devices that should get the lightweight hall-walk fallback. */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2) return true;
  return false;
}