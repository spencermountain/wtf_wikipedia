// Restore fetch even when an assertion or request fails.
const mockFetch = async (response, run) => {
  const original = globalThis.fetch
  const requests = []
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options })
    return { ok: true, json: async () => response }
  }
  try {
    await run(requests)
  } finally {
    globalThis.fetch = original
  }
}

export default mockFetch
