import test from 'tape'
import getRedirects from '../../src/getRedirects.js'
import getIncoming from '../../src/getIncoming.js'
import getPageViews from '../../src/getPageViews.js'

// options shaped like a fetched document's .options() - the bare project
// domain and 'api.php' path are unusable as-is, and must be rebuilt
const docOptions = { lang: 'fr', domain: 'wikipedia.org', path: 'api.php', wiki: 'wikipedia' }

const mockHttp = () => {
  const http = async (url) => {
    http.urls.push(url)
    return { query: { pages: {} } }
  }
  http.urls = []
  return http
}

test('doc-style options build a real api url', async (t) => {
  let http = mockHttp()
  await getRedirects('Toronto', docOptions, http)
  t.ok(http.urls[0].startsWith('https://fr.wikipedia.org/w/api.php?'), 'getRedirects rebuilds the host')
  http = mockHttp()
  await getIncoming('Toronto', docOptions, http)
  t.ok(http.urls[0].startsWith('https://fr.wikipedia.org/w/api.php?'), 'getIncoming rebuilds the host')
  http = mockHttp()
  await getPageViews({ title: 'Toronto' }, docOptions, http)
  t.ok(http.urls[0].startsWith('https://fr.wikipedia.org/w/api.php?'), 'getPageViews rebuilds the host')
  t.end()
})

test('a 3rd-party domain is kept as-is', async (t) => {
  const http = mockHttp()
  await getRedirects('Miss Piggy', { domain: 'muppet.fandom.com', path: 'api.php' }, http)
  t.ok(http.urls[0].startsWith('https://muppet.fandom.com/api.php?'), 'domain + path untouched')
  t.end()
})
