/* global URLSearchParams, fetch */
const UA = 'wtf_wikipedia test script - <spencermountain@gmail.com>'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// render wikitext → html with the parse api, retrying on rate-limits
const renderOnWikipedia = async (wikitext, { lang = 'en', title = 'Test', domain } = {}) => {
  const url = `https://${domain || lang + '.wikipedia.org'}/w/api.php`
  const body = new URLSearchParams({
    action: 'parse',
    format: 'json',
    formatversion: '2',
    contentmodel: 'wikitext',
    prop: 'text',
    disablelimitreport: '1',
    disableeditsection: '1',
    title,
    text: wikitext,
  })
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const res = await fetch(url, { method: 'POST', body, headers: { 'User-Agent': UA, 'Api-User-Agent': UA } })
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get('retry-after')) * 1000 || 2000 * Math.pow(2, attempt)
      await sleep(wait)
      continue
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${url}`)
    }
    const json = await res.json()
    if (json.error) {
      throw new Error(json.error.info || 'parse error')
    }
    return json.parse.text
  }
  throw new Error('rate-limited: ' + url)
}
export default renderOnWikipedia
