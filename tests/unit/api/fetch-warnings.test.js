/* eslint-disable no-console */
import test from 'tape'
import assert from 'node:assert/strict'
import wtf from '../../lib/index.js'

// capture console.warn output, restoring it afterward
const stubWarn = function () {
  const calls = []
  const original = console.warn
  console.warn = (...args) => calls.push(args.join(' '))
  return { calls, restore: () => (console.warn = original) }
}

// swap globalThis.fetch for one stubbed response (or rejection)
const mockResponse = async (makeRes, run) => {
  const original = globalThis.fetch
  globalThis.fetch = async () => makeRes()
  try {
    await run()
  } finally {
    globalThis.fetch = original
  }
}

test('429 rejects, and warns to slow down', async (t) => {
  const warn = stubWarn()
  const res = () => ({ ok: false, status: 429, headers: { get: () => '5' } })
  await mockResponse(res, async () => {
    await assert.rejects(wtf.fetch('Toronto'), { message: /^HTTP 429/ }, 'still rejects')
  })
  warn.restore()
  t.equal(warn.calls.length, 1, 'one warning printed')
  t.ok(/too many requests/.test(warn.calls[0]), 'explains the status code')
  t.ok(/slow down/.test(warn.calls[0]), 'says to slow down')
  t.ok(/retry-after: 5s/.test(warn.calls[0]), 'passes-through retry-after header')
  t.end()
})

test('403 warns about the User-Agent policy', async (t) => {
  const warn = stubWarn()
  const res = () => ({ ok: false, status: 403 })
  await mockResponse(res, async () => {
    await assert.rejects(wtf.fetch('Toronto'), { message: /^HTTP 403/ }, 'still rejects')
  })
  warn.restore()
  t.ok(/User-Agent/.test(warn.calls[0] || ''), 'mentions user-agent')
  t.ok(/Api-User-Agent/.test(warn.calls[0] || ''), 'shows the fix')
  t.end()
})

test('api error inside a 200-ok response still warns', async (t) => {
  const warn = stubWarn()
  const res = () => ({ ok: true, json: async () => ({ error: { code: 'maxlag', info: 'Waiting for a db' } }) })
  let doc = 'unset'
  await mockResponse(res, async () => {
    doc = await wtf.fetch('Toronto')
  })
  warn.restore()
  t.equal(doc, null, 'resolves null, as before')
  t.ok(/lagged/.test(warn.calls[0] || ''), 'explains the maxlag error')
  t.end()
})

test('network failure warns, then rejects', async (t) => {
  const warn = stubWarn()
  const boom = () => {
    throw new TypeError('fetch failed')
  }
  await mockResponse(boom, async () => {
    await assert.rejects(wtf.fetch('Toronto'), { name: 'TypeError' }, 'original error still rejects')
  })
  warn.restore()
  t.ok(/network error/.test(warn.calls[0] || ''), 'explains the network failure')
  t.end()
})
