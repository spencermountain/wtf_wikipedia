const { normalize, defaults, toUrlParams } = require('./_fns')

const params = {
  action: 'query',
  lhnamespace: 0,
  prop: 'linkshere',
  lhshow: '!redirect',
  lhlimit: 500,
  format: 'json',
  origin: '*',
  redirects: true
}

const makeUrl = function (title, options, cursor) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += toUrlParams(params)
  url += `&titles=${normalize(title)}`
  if (cursor) {
    url += '&lhcontinue=' + cursor
  }
  return url
}

const getIncoming = function (doc, http) {
  let url = makeUrl(doc.title(), defaults)
  return http(url).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].linkshere || []
  })
}
module.exports = getIncoming
