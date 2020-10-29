const { normalize, defaults, toUrlParams } = require('./_fns')

const params = {
  action: 'query',
  rdnamespace: 0,
  prop: 'redirects',
  rdlimit: 500,
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
    url += '&rdcontinue=' + cursor
  }
  return url
}

const getRedirects = function (doc, http) {
  let url = makeUrl(doc.title(), defaults)
  return http(url).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].redirects || []
  })
}
module.exports = getRedirects
