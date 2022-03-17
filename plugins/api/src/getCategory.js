const { normalize, defaults, toUrlParams } = require('./_fns')

const params = {
  action: 'query',
  list: 'categorymembers',
  cmlimit: 500,
  cmtype: 'page|subcat',
  cmnamespace: 0,
  format: 'json',
  origin: '*',
  redirects: true
}

const fetchIt = function (url, http, prop) {
  return http(url).then((res) => {
    let pages = Object.keys(res.query[prop] || {})
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    let arr = pages.map((k) => res.query[prop][k])
    return {
      pages: arr,
      cursor: res.continue
    }
  })
}

const makeUrl = function (title, options, append) {
  let url = `https://${options.lang}.wikipedia.org/${options.path}?`
  if (options.domain) {
    url = `https://${options.domain}/${options.path}?`
  }
  url += toUrlParams(params)
  if (/^Category/i.test(title) === false) {
    title = 'Category:' + title
  }
  url += `&cmtitle=${normalize(title)}`
  if (append) {
    url += append
  }
  return url
}

const getCategory = async function (title, options, http) {
  let list = []
  let getMore = true
  let append = ''
  while (getMore) {
    let url = makeUrl(title, options, append)
    let { pages, cursor } = await fetchIt(url, http, 'categorymembers')
    list = list.concat(pages)
    if (cursor && cursor.cmcontinue) {
      append = '&cmcontinue=' + cursor.lhcontinue
    } else {
      getMore = false
    }
  }
  return list
}
module.exports = getCategory
