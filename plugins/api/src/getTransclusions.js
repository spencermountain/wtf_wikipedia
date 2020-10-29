const { normalize, defaults, toUrlParams } = require('./_fns')

const params = {
  action: 'query',
  tinamespace: 0,
  prop: 'transcludedin',
  tilimit: 500,
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
    url += '&ticontinue=' + cursor
  }
  return url
}

// fetch all the pages that use a specific template
const getTransclusions = function (template, _options, http) {
  let url = makeUrl(template, defaults)
  return http(url).then((res) => {
    let pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return []
    }
    return res.query.pages[pages[0]].transcludedin || []
  })
}
module.exports = getTransclusions
