import { normalize, defaults, toUrlParams } from './_fns.js'

const params = {
  action: 'query',
  prop: 'pageviews',
  format: 'json',
  origin: '*',
  redirects: true,
}

function makeUrl (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += toUrlParams(params)
  url += `&titles=${normalize(title)}`
  if (append) {
    url += append
  }
  return url
}

function getPageViews (doc, http) {
  let url = makeUrl(doc.title(), defaults)
  return http(url).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].pageviews || []
  })
}
export default getPageViews
