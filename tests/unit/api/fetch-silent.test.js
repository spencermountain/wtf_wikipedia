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

test('silent: http error still rejects, with no warning', async (t) => {
  const warn = stubWarn()
  const res = () => ({ ok: false, status: 503, headers: { get: () => null } })
  await mockResponse(res, async () => {
    await assert.rejects(wtf.fetch('Toronto', { silent: true }), { message: /^HTTP 503/ }, 'still rejects')
  })
  warn.restore()
  t.equal(warn.calls.length, 0, 'no warning printed')
  t.end()
})

test('silent: api error inside a 200-ok response stays quiet', async (t) => {
  const warn = stubWarn()
  const res = () => ({ ok: true, json: async () => ({ error: { code: 'ratelimited', info: 'slow down' } }) })
  let doc = 'unset'
  await mockResponse(res, async () => {
    doc = await wtf.fetch('Toronto', { silent: true })
  })
  warn.restore()
  t.equal(doc, null, 'resolves null, as before')
  t.equal(warn.calls.length, 0, 'no warning printed')
  t.end()
})

test('silent: network failure still rejects, with no warning', async (t) => {
  const warn = stubWarn()
  const boom = () => {
    throw new TypeError('fetch failed')
  }
  await mockResponse(boom, async () => {
    await assert.rejects(wtf.fetch('Toronto', { silent: true }), { name: 'TypeError' }, 'original error still rejects')
  })
  warn.restore()
  t.equal(warn.calls.length, 0, 'no warning printed')
  t.end()
})
