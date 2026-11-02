import test from 'tape'
import wtf from '../../lib/index.js'

// queue up several responses, served one per request
const mockQueue = async (responses, run) => {
  const original = globalThis.fetch
  const requests = []
  globalThis.fetch = async (url) => {
    requests.push(String(url))
    const res = responses.shift()
    return { ok: true, json: async () => res }
  }
  try {
    await run(requests)
  } finally {
    globalThis.fetch = original
  }
}

const rev = (content) => [{ revid: 1, timestamp: '2024-01-01T00:00:00Z', slots: { main: { content } } }]

test('fetch: follows continue to collect pages that did not fit', async (t) => {
  const first = {
    batchcomplete: false,
    continue: { rvcontinue: '123|456', continue: '||' },
    query: {
      pages: [
        { pageid: 1, ns: 0, title: 'Tokyo', revisions: rev('tokyo!'), pageprops: {} },
        { pageid: 2, ns: 0, title: 'Oslo', pageprops: {} }, // no revisions - didn't fit
      ],
    },
  }
  const second = {
    batchcomplete: true,
    query: {
      pages: [
        { pageid: 1, ns: 0, title: 'Tokyo' },
        { pageid: 2, ns: 0, title: 'Oslo', revisions: rev('oslo!') },
      ],
    },
  }
  await mockQueue([first, second], async (requests) => {
    const docs = await wtf.fetch(['Tokyo', 'Oslo'])
    t.equal(requests.length, 2, 'two requests made')
    t.ok(requests[1].includes('rvcontinue='), 'second request carries the continue params')
    t.deepEqual(
      docs.map((d) => d.text()),
      ['tokyo!', 'oslo!'],
      'both pages have content, in order'
    )
  })
  t.end()
})

test('fetch: boundary page with empty revisions gets filled by the continue', async (t) => {
  const first = {
    batchcomplete: false,
    continue: { rvcontinue: '2|9', continue: '||' },
    query: {
      pages: [
        { pageid: 1, ns: 0, title: 'Tokyo', revisions: rev('tokyo!'), pageprops: {} },
        { pageid: 2, ns: 0, title: 'Oslo', revisions: [], pageprops: {} }, // straddles the cut
      ],
    },
  }
  const second = {
    batchcomplete: true,
    query: { pages: [{ pageid: 2, ns: 0, title: 'Oslo', revisions: rev('oslo!') }] },
  }
  await mockQueue([first, second], async () => {
    const docs = await wtf.fetch(['Tokyo', 'Oslo'])
    t.deepEqual(
      docs.map((d) => d.text()),
      ['tokyo!', 'oslo!'],
      'empty revisions got replaced'
    )
  })
  t.end()
})

test('fetch: batchcomplete stops the continue loop', async (t) => {
  // 'continue' alongside batchcomplete only pages-through older revisions
  const only = {
    batchcomplete: true,
    continue: { rvcontinue: '999', continue: '||' },
    query: { pages: [{ pageid: 1, ns: 0, title: 'Tokyo', revisions: rev('tokyo!'), pageprops: {} }] },
  }
  await mockQueue([only], async (requests) => {
    const doc = await wtf.fetch('Tokyo')
    t.equal(doc.text(), 'tokyo!', 'page returned')
    t.equal(requests.length, 1, 'no second request')
  })
  t.end()
})

test('fetch: gives up continuing after the loop cap', async (t) => {
  // a misbehaving wiki that asks us to continue, forever
  const make = () => ({
    batchcomplete: false,
    continue: { rvcontinue: 'x', continue: '||' },
    query: { pages: [{ pageid: 1, ns: 0, title: 'Tokyo', revisions: rev('tokyo!'), pageprops: {} }] },
  })
  const responses = Array.from({ length: 30 }, make)
  await mockQueue(responses, async (requests) => {
    const doc = await wtf.fetch('Tokyo')
    t.equal(doc.text(), 'tokyo!', 'still returns the page')
    t.ok(requests.length <= 11, 'stopped after the cap: ' + requests.length)
  })
  t.end()
})
