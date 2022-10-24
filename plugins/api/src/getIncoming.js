import { normalize, defaults, toUrlParams, fetchOne } from './_fns.js'

const params = {
  action: 'query',
  lhnamespace: 0,
  prop: 'linkshere',
  lhshow: '!redirect',
  lhlimit: 500,
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

const getIncoming = async function (title, http) {
  let list = []
  let getMore = true
  let append = ''
  while (getMore) {
    let url = makeUrl(title, defaults, append)
    let { pages, cursor } = await fetchOne(url, http, 'linkshere')
    list = list.concat(pages)
    if (cursor && cursor.lhcontinue) {
      append = '&lhcontinue=' + cursor.lhcontinue
    } else {
      getMore = false
    }
  }
  return list
}
export default getIncoming
