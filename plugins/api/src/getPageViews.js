const { normalize, defaults } = require('./_fns')

const makeUrl = function (title, options, cursor) {
  title = normalize(title)
  title = encodeURIComponent(title)
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += `action=query&titles=${title}&prop=pageviews&format=json&origin=*&redirects=true`
  if (cursor) {
    url += '&rdcontinue=' + cursor
  }
  return url
}

const getPageViews = function (doc, http) {
  let url = makeUrl(doc.title(), defaults)
  return http(url).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].pageviews || []
  })
}
module.exports = getPageViews
