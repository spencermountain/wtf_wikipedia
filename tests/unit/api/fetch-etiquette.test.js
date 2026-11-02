/* eslint-disable no-console */
import test from 'tape'
import wtf from '../../lib/index.js'

const page = (pageid, title) => ({
  pageid,
  ns: 0,
  title,
  revisions: [{ revid: 1, timestamp: '2024-01-01T00:00:00Z', slots: { main: { content: 'hello' } } }],
  pageprops: {},
})

// serve queued responses, tracking each request + how many ran at once
const mockQueue = async (responses, run) => {
  const original = globalThis.fetch
  const requests = []
  let inflight = 0
  let maxInflight = 0
  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), init })
    inflight += 1
    maxInflight = Math.max(maxInflight, inflight)
    await new Promise((ok) => setTimeout(ok, 5))
    inflight -= 1
    const res = responses.shift()
    return typeof res === 'function' ? res() : res
  }
  try {
    await run(requests, () => maxInflight)
  } finally {
    globalThis.fetch = original
  }
}

const ok = (pages) => ({ ok: true, headers: { get: () => null }, json: async () => ({ batchcomplete: true, query: { pages } }) })

test('etiquette: chunked requests run one-at-a-time', async (t) => {
  const titles = Array.from({ length: 120 }, (_, i) => `Page ${i}`)
  const res = () => ok(titles.map((title, i) => page(i + 1, title)))
  await mockQueue([res(), res(), res()], async (requests, maxInflight) => {
    await wtf.fetch(titles)
    t.equal(requests.length, 3, 'three chunked requests')
    t.equal(maxInflight(), 1, 'requests ran serially')
  })
  t.end()
})

// note: the retry-and-succeed cases sleep through real waits - they live in tests/fetch/retry.test.js

test('etiquette: 429 without Retry-After is not retried', async (t) => {
  const warnOriginal = console.warn
  console.warn = () => null
  const slow = { ok: false, status: 429, headers: { get: () => null } }
  await mockQueue([slow], async (requests) => {
    let error = null
    try {
      await wtf.fetch('Tokyo')
    } catch (e) {
      error = e
    }
    t.ok(error, 'rejects')
    t.equal(requests.length, 1, 'no blind retry')
  })
  console.warn = warnOriginal
  t.end()
})

test('etiquette: default user-agent identifies the library', async (t) => {
  await mockQueue([ok([page(1, 'Tokyo')])], async (requests) => {
    await wtf.fetch('Tokyo')
    const agent = requests[0].init.headers['User-Agent']
    t.ok(/^wtf_wikipedia\/\d/.test(agent), 'name/version format: ' + agent)
    t.ok(agent.includes('github.com'), 'has a contact url')
  })
  t.end()
})
