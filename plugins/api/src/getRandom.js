const { defaults, toUrlParams } = require('./_fns')

const params = {
  action: 'query',
  generator: 'random',
  grnnamespace: '0',
  prop: 'pageprops',
  grnlimit: '1',
  rvslots: 'main',
  format: 'json',
  origin: '*',
  redirects: 'true'
}

const fetchIt = function (url, http) {
  return http(url).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    return res.query.pages[pages[0]]
  })
}

const makeUrl = function (options) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += toUrlParams(params)
  return url
}

const getRandom = async function (_options, http) {
  let url = makeUrl(defaults)
  let page = await fetchIt(url, http)
  return page
}
module.exports = getRandom
