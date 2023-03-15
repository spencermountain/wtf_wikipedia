import makeHeaders from 'wtf_wikipedia/src/_fetch/_headers.js'
import { normalize, defaults, toUrlParams } from './_fns.js'

const params = {
  action: 'query',
  prop: 'pageviews',
  format: 'json',
  origin: '*',
  redirects: true
}

const makeUrl = function (title, options, append) {
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

const getPageViews = function (doc, options, http) {
  options = { ...defaults, ...options }
  let url = makeUrl(doc.title(), options)
  const headers = makeHeaders(options)
  return http(url, headers).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].pageviews || []
  })
}
export default getPageViews
