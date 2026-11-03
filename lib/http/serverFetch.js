const DEFAULT_TIMEOUT_MS = 10000;

function resolveTimeoutMs(timeoutMs) {
  if (Number.isFinite(timeoutMs) && timeoutMs > 0) return timeoutMs;

  const fromEnv = Number.parseInt(process.env.SERVER_FETCH_TIMEOUT_MS || '', 10);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;

  return DEFAULT_TIMEOUT_MS;
}

/**
 * fetch with a hard timeout so Next static generation cannot hang
 * when the backend is slow or returns a late gateway error.
 */
export async function serverFetch(url, options = {}) {
  const { timeoutMs, signal: outerSignal, ...rest } = options;
  const timeout = resolveTimeoutMs(timeoutMs);
  const timeoutSignal = AbortSignal.timeout(timeout);

  const signal = outerSignal
    ? AbortSignal.any([outerSignal, timeoutSignal])
    : timeoutSignal;

  return fetch(url, {
    ...rest,
    signal,
  });
}
