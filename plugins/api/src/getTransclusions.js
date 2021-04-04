const { normalize, defaults, toUrlParams, fetchOne } = require('./_fns')

const params = {
  action: 'query',
  tinamespace: 0,
  prop: 'transcludedin',
  tilimit: 500,
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
  // support custom cursor params
  if (append) {
    url += append
  }
  return url
}

// fetch all the pages that use a specific template
const getTransclusions = async function (template, _options, http) {
  let list = []
  let getMore = true
  let append = ''
  while (getMore) {
    let url = makeUrl(template, defaults, append)
    let { pages, cursor } = await fetchOne(url, http, 'transcludedin')
    list = list.concat(pages)
    if (cursor && cursor.ticontinue) {
      append = '&ticontinue=' + cursor.ticontinue
    } else {
      getMore = false
    }
  }
  return list
}
module.exports = getTransclusions
