/**
 * Lightweight client-side metrics recorder for readiness signals.
 * Stores metrics on window.__xentriMetrics for later inspection/logging.
 */
type MetricsStore = {
  timings: Record<string, number[]>;
  counters: Record<string, number>;
};

function getStore(): MetricsStore | null {
  if (typeof window === 'undefined') return null;
  const w = window as typeof window & { __xentriMetrics?: MetricsStore };
  if (!w.__xentriMetrics) {
    w.__xentriMetrics = { timings: {}, counters: {} };
  }
  return w.__xentriMetrics;
}

export function recordTiming(name: string, valueMs: number): void {
  const store = getStore();
  if (!store || Number.isNaN(valueMs)) return;
  store.timings[name] = store.timings[name] || [];
  store.timings[name].push(Math.max(0, valueMs));
  // Keep last 20 samples to avoid unbounded growth
  if (store.timings[name].length > 20) {
    store.timings[name] = store.timings[name].slice(-20);
  }
}

export function incrementCounter(name: string, delta = 1): void {
  const store = getStore();
  if (!store) return;
  store.counters[name] = (store.counters[name] || 0) + delta;
}

export function logMetrics(label: string): void {
  const store = getStore();
  if (!store) return;
  // eslint-disable-next-line no-console
  console.info(`[metrics] ${label}`, store);
}
