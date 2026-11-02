/* eslint-disable no-console */
import test from 'tape'
import assert from 'node:assert/strict'
import wtf from '../lib/index.js'

// these tests sleep through real Retry-After waits, so they live in the slow suite.
// they stub globalThis.fetch - no network needed.

// capture console.warn output, restoring it afterward
const stubWarn = function () {
  const calls = []
  const original = console.warn
  console.warn = (...args) => calls.push(args.join(' '))
  return { calls, restore: () => (console.warn = original) }
}

// serve queued responses, one per request
const mockQueue = async (responses, run) => {
  const original = globalThis.fetch
  const requests = []
  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), init })
    const res = responses.shift()
    return typeof res === 'function' ? res() : res
  }
  try {
    await run(requests)
  } finally {
    globalThis.fetch = original
  }
}

const page = (pageid, title) => ({
  pageid,
  ns: 0,
  title,
  revisions: [{ revid: 1, timestamp: '2024-01-01T00:00:00Z', slots: { main: { content: 'hello' } } }],
  pageprops: {},
})

const ok = (pages) => ({ ok: true, headers: { get: () => null }, json: async () => ({ batchcomplete: true, query: { pages } }) })

test('429 that keeps failing rejects, and warns to slow down', async (t) => {
  const warn = stubWarn()
  const slow = () => ({ ok: false, status: 429, headers: { get: () => '5' } })
  await mockQueue([slow, slow], async (requests) => {
    await assert.rejects(wtf.fetch('Toronto'), { message: /^HTTP 429/ }, 'still rejects')
    t.equal(requests.length, 2, 'waited and retried once before giving up')
  })
  warn.restore()
  t.equal(warn.calls.length, 1, 'one warning printed')
  t.ok(/too many requests/.test(warn.calls[0]), 'explains the status code')
  t.ok(/slow down/.test(warn.calls[0]), 'says to slow down')
  t.ok(/retry-after: 5s/.test(warn.calls[0]), 'passes-through retry-after header')
  t.end()
})

test('429 with a short Retry-After is retried, once', async (t) => {
  const slow = { ok: false, status: 429, headers: { get: () => '1' } }
  await mockQueue([slow, ok([page(1, 'Tokyo')])], async (requests) => {
    const doc = await wtf.fetch('Tokyo')
    t.equal(requests.length, 2, 'request was retried')
    t.equal(doc.text(), 'hello', 'retry succeeded')
  })
  t.end()
})

test('maxlag asks us to wait - retried, once', async (t) => {
  const lagged = {
    ok: true,
    headers: { get: () => '1' },
    json: async () => ({ error: { code: 'maxlag', info: 'Waiting for a db' } }),
  }
  await mockQueue([lagged, ok([page(1, 'Tokyo')])], async (requests) => {
    const doc = await wtf.fetch('Tokyo')
    t.equal(requests.length, 2, 'request was retried')
    t.equal(doc.text(), 'hello', 'retry succeeded')
  })
  t.end()
})
