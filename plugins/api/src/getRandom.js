import { defaults, toUrlParams } from './_fns.js'

const params = {
  action: 'query',
  generator: 'random',
  grnnamespace: '0',
  prop: 'revisions',
  rvprop: 'content',
  grnlimit: '1',
  rvslots: 'main',
  format: 'json',
  origin: '*',
  redirects: 'true',
}

function fetchIt (url, http) {
  return http(url).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    return res.query.pages[pages[0]]
  })
}

function makeUrl (options) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += toUrlParams(params)
  return url
}

const getRandom = async function (_options, http, wtf) {
  let url = makeUrl(defaults)
  let page = {}
  try {
    page = await fetchIt(url, http) || {}
  } catch (e) {
    console.error(e)
  }
  let title = page.title
  let wiki = ''
  if (page.revisions && page.revisions[0] && page.revisions[0].slots) {
    wiki = page.revisions[0].slots.main['*'] || ''
  }
  let doc = wtf(wiki, { title })
  return doc
}
export default getRandom
