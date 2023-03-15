import { normalize, defaults, toUrlParams, fetchOne } from './_fns.js'

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
  let options = { ...defaults, ..._options }
  let list = []
  let getMore = true
  let append = ''
  while (getMore) {
    let url = makeUrl(template, options, append)
    let { pages, cursor } = await fetchOne(url, options, http, 'transcludedin')
    list = list.concat(pages)
    if (cursor && cursor.ticontinue) {
      append = '&ticontinue=' + cursor.ticontinue
    } else {
      getMore = false
    }
  }
  return list
}
export default getTransclusions
