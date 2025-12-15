// filepath: rn-starter/utils/requestCache.js
// 간단한 in-memory 요청 캐시/중복 제거 유틸 (React Native 런타임)

const inflight = new Map();

/**
 * 같은 key로 동시에 여러 번 호출되면 최초 Promise를 공유합니다.
 * ttlMs 동안은 resolved 값도 캐시합니다.
 */
export function dedupeRequest(key, fn, { ttlMs = 3000 } = {}) {
  const now = Date.now();
  const existing = inflight.get(key);

  if (existing) {
    if (existing.status === 'pending') return existing.promise;
    if (existing.status === 'resolved' && now - existing.resolvedAt < ttlMs) return existing.promise;
    if (existing.status === 'rejected' && now - existing.rejectedAt < 300) return existing.promise;
  }

  const promise = (async () => {
    try {
      const value = await fn();
      inflight.set(key, { status: 'resolved', promise: Promise.resolve(value), resolvedAt: Date.now() });
      return value;
    } catch (err) {
      inflight.set(key, { status: 'rejected', promise: Promise.reject(err), rejectedAt: Date.now() });
      throw err;
    }
  })();

  inflight.set(key, { status: 'pending', promise });
  return promise;
}

export function clearRequestCache(prefix = '') {
  if (!prefix) {
    inflight.clear();
    return;
  }
  for (const key of inflight.keys()) {
    if (String(key).startsWith(prefix)) inflight.delete(key);
  }
}
