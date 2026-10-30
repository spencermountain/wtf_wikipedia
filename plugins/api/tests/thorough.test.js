import test from 'tape'
import wtf from './_lib.js'
import { normalize, toUrlParams, defaults } from '../src/_fns.js'
import makeHeaders from '../src/_headers.js'
import getRedirects from '../src/getRedirects.js'
import getIncoming from '../src/getIncoming.js'
import getPageViews from '../src/getPageViews.js'
import getTransclusions from '../src/getTransclusions.js'
import getCategory from '../src/getCategory.js'
import getRandom from '../src/getRandom.js'
import getRandomCategory from '../src/getRandomCategory.js'
import fetchList from '../src/fetchList.js'

// fake http: returns queued responses in order, records every request
const mockHttp = (...responses) => {
  const calls = []
  const http = async (url, headers) => {
    calls.push({ url, headers })
    return responses[Math.min(calls.length - 1, responses.length - 1)]
  }
  http.calls = calls
  return http
}
const pagesRes = (prop, list, cont) => ({
  query: { pages: { 123: { [prop]: list } } },
  ...(cont ? { continue: cont } : {}),
})
const params = (url) => new URL(url).searchParams

test('api helpers', (t) => {
  t.equal(normalize('Toronto Blue Jays'), 'Toronto_Blue_Jays', 'spaces → underscores')
  t.equal(normalize('AC/DC'), 'AC%2FDC', 'url-encoded')
  t.equal(normalize('Café'), 'Caf%C3%A9', 'unicode encoded')
  t.equal(normalize(), '', 'empty title')
  t.equal(toUrlParams({ a: 1, 'b c': 'x&y' }), 'a=1&b%20c=x%26y', 'params encoded')
  t.deepEqual(defaults, { lang: 'en', path: 'w/api.php' }, 'defaults')
  t.end()
})

test('api normalize trims before replacing spaces', (t) => {
  t.equal(normalize(' Toronto '), 'Toronto', 'surrounding whitespace should not become underscores')
  t.end()
})

test('api headers', (t) => {
  const h = makeHeaders({})
  t.equal(h.method, 'GET', 'GET request')
  t.equal(h.headers['Api-User-Agent'], 'User of the wtf_wikipedia library', 'default user agent')
  t.equal(h.headers.Origin, '*', 'default origin')
  t.equal(makeHeaders({ userAgent: 'me@x.com' }).headers['User-Agent'], 'me@x.com', 'userAgent option')
  t.equal(makeHeaders({ 'Api-User-Agent': 'bot' }).headers['Api-User-Agent'], 'bot', 'Api-User-Agent option')
  t.equal(makeHeaders({ noOrigin: true }).headers.Origin, '', 'noOrigin')
  t.equal(makeHeaders({ origin: 'https://a.b' }).headers.Origin, 'https://a.b', 'custom origin')
  t.end()
})

test('getIncoming: url, paging, results', async (t) => {
  const http = mockHttp(
    pagesRes('linkshere', [{ title: 'A' }], { lhcontinue: 'abc' }),
    pagesRes('linkshere', [{ title: 'B' }])
  )
  const res = await getIncoming('Toronto Raptors', {}, http)
  t.deepEqual(
    res.map((p) => p.title),
    ['A', 'B'],
    'pages from both requests'
  )
  t.equal(http.calls.length, 2, 'followed the cursor')
  const url = http.calls[0].url
  t.ok(url.startsWith('https://en.wikipedia.org/w/api.php?'), 'default host')
  t.equal(params(url).get('prop'), 'linkshere', 'linkshere prop')
  t.equal(params(url).get('titles'), 'Toronto_Raptors', 'normalized title')
  t.equal(params(http.calls[1].url).get('lhcontinue'), 'abc', 'cursor appended')
  t.end()
})

test('getIncoming: lang and domain options', async (t) => {
  const http = mockHttp(pagesRes('linkshere', []))
  await getIncoming('Paris', { lang: 'fr' }, http)
  t.ok(http.calls[0].url.startsWith('https://fr.wikipedia.org/'), 'lang option')
  await getIncoming('Paris', { domain: 'wiki.example.org', path: 'api.php' }, http)
  t.ok(http.calls[1].url.startsWith('https://wiki.example.org/api.php?'), 'domain + path options')
  const empty = await getIncoming('x', {}, mockHttp({ query: {} }))
  t.deepEqual(empty, [], 'no pages → empty list')
  t.end()
})

test('getRedirects', async (t) => {
  const http = mockHttp(pagesRes('redirects', [{ title: 'T.O.' }, { title: 'Hogtown' }]))
  const res = await getRedirects('Toronto', {}, http)
  t.deepEqual(
    res.map((p) => p.title),
    ['T.O.', 'Hogtown'],
    'redirect titles'
  )
  t.equal(params(http.calls[0].url).get('prop'), 'redirects', 'redirects prop')
  t.equal(params(http.calls[0].url).get('rdlimit'), '500', 'max limit')
  t.end()
})

test('getRedirects paging uses the rdcontinue cursor', async (t) => {
  const http = mockHttp(
    pagesRes('redirects', [{ title: 'A' }], { rdcontinue: 'r1' }),
    pagesRes('redirects', [{ title: 'B' }])
  )
  await getRedirects('Toronto', {}, http)
  t.equal(params(http.calls[1].url).get('rdcontinue'), 'r1', 'should append cursor.rdcontinue, not cursor.lhcontinue')
  t.end()
})

test('getTransclusions', async (t) => {
  const http = mockHttp(
    pagesRes('transcludedin', [{ title: 'A' }], { ticontinue: 't1' }),
    pagesRes('transcludedin', [{ title: 'B' }])
  )
  const res = await getTransclusions('Template:Infobox person', {}, http)
  t.deepEqual(
    res.map((p) => p.title),
    ['A', 'B'],
    'all pages'
  )
  t.equal(params(http.calls[0].url).get('titles'), 'Template:Infobox_person', 'template title')
  t.equal(params(http.calls[1].url).get('ticontinue'), 't1', 'cursor')
  t.end()
})

test('getPageViews', async (t) => {
  const views = { '2024-01-01': 10, '2024-01-02': 12 }
  const http = mockHttp(pagesRes('pageviews', views))
  const res = await getPageViews({ title: 'Toronto' }, {}, http)
  t.deepEqual(res, views, 'pageviews object')
  t.equal(params(http.calls[0].url).get('titles'), 'Toronto', 'uses doc.title')
  t.deepEqual(await getPageViews({ title: 'x' }, {}, mockHttp({ query: {} })), [], 'no pages → []')
  t.end()
})

test('getCategory', async (t) => {
  const members = (list, cont) => ({ query: { categorymembers: list }, ...(cont ? { continue: cont } : {}) })
  const http = mockHttp(
    members([{ title: 'A', type: 'page' }], { cmcontinue: 'c1' }),
    members([{ title: 'B', type: 'page' }])
  )
  const res = await getCategory('Canadian musicians', {}, http)
  t.deepEqual(
    res.map((p) => p.title),
    ['A', 'B'],
    'paged members'
  )
  t.equal(params(http.calls[0].url).get('cmtitle'), 'Category:Canadian_musicians', 'Category: prefix added')
  t.equal(params(http.calls[1].url).get('cmcontinue'), 'c1', 'cursor')
  const http2 = mockHttp(members([]))
  await getCategory('Catégorie:Musique', {}, http2)
  t.equal(params(http2.calls[0].url).get('cmtitle'), 'Catégorie:Musique', 'localized prefix kept')
  t.end()
})

test('getCategory recursive', async (t) => {
  const tree = {
    'Category:Root': [
      { title: 'Page1', type: 'page' },
      { title: 'Category:Sub', type: 'subcat' },
      { title: 'Category:Skip', type: 'subcat' },
    ],
    'Category:Sub': [
      { title: 'Page2', type: 'page' },
      { title: 'Category:Root', type: 'subcat' },
    ],
    'Category:Skip': [{ title: 'Page3', type: 'page' }],
  }
  const http = async (url) => ({
    query: { categorymembers: tree[params(url).get('cmtitle').replace(/_/g, ' ')] || [] },
  })
  const all = await getCategory('Root', { recursive: true }, http)
  const titles = all.map((p) => p.title)
  t.ok(titles.includes('Page2'), 'subcategory pages included')
  t.ok(titles.includes('Page3'), 'all subcategories visited')
  const excl = await getCategory('Root', { recursive: true, categoryExclusions: ['Category:Skip'] }, http)
  t.notOk(excl.map((p) => p.title).includes('Page3'), 'excluded category skipped')
  const shallow = await getCategory('Root', { recursive: true, maxDepth: 0 }, http)
  t.deepEqual(
    shallow.map((p) => p.title),
    ['Page1', 'Category:Sub', 'Category:Skip'],
    'maxDepth 0 = no recursion'
  )
  t.end()
})

test('getRandom + getRandomCategory', async (t) => {
  const http = mockHttp({
    query: {
      pages: {
        9: { title: 'Lucky Page', revisions: [{ slots: { main: { '*': "'''Lucky Page''' is a [[page]]." } } }] },
      },
    },
  })
  const doc = await getRandom({}, http, wtf)
  t.equal(doc.title, 'Lucky Page', 'title from response')
  t.equal(doc.text(), 'Lucky Page is a page.', 'wikitext parsed')
  t.equal(params(http.calls[0].url).get('generator'), 'random', 'random generator')
  t.equal(params(http.calls[0].url).get('grnnamespace'), '0', 'article namespace')
  const cat = await getRandomCategory({}, mockHttp({ query: { pages: { 1: { title: 'Category:Cats' } } } }))
  t.equal(cat, 'Category:Cats', 'random category title')
  t.equal(typeof wtf.random, 'function', 'wtf.random alias')
  t.end()
})

test('fetchList chunks into groups of 5', async (t) => {
  const groups = []
  const fakeWtf = {
    fetch: async (group) => {
      groups.push(group)
      return group.map((title) => ({ title }))
    },
  }
  const titles = Array.from({ length: 12 }, (_, i) => 'P' + i)
  const res = await fetchList(titles, {}, fakeWtf)
  t.deepEqual(
    groups.map((g) => g.length),
    [5, 5, 2],
    'three groups'
  )
  t.equal(res.length, 12, 'flattened result')
  await fetchList([{ title: 'X' }, { title: 'Y' }], {}, fakeWtf)
  t.deepEqual(groups[3], ['X', 'Y'], 'objects mapped to titles')
  t.end()
})

test('doc.getRedirects / doc.getIncoming use the title getter', (t) => {
  const doc = wtf('hello', { title: 'Toronto', domain: 'example.invalid' })
  t.doesNotThrow(() => doc.getRedirects().catch(() => {}), 'doc.title is a getter, not a function')
  t.doesNotThrow(() => doc.getIncoming().catch(() => {}), 'doc.title is a getter, not a function')
  t.end()
})
