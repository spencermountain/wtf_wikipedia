const isInterWiki = /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/

const defaults = {
  action: 'query',
  prop: 'revisions|pageprops', //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  rvprop: 'content',
  maxlag: 5,
  rvslots: 'main',
  origin: '*',
  format: 'json',
  redirects: 'true',
}

const toQueryString = function (obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')
}

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

const cleanTitle = (page) => {
  page = page.replace(/ /g, '_')
  page = page.trim()
  // page = encodeURIComponent(page)
  return page
}

const makeUrl = function (options) {
  let params = Object.assign({}, defaults)
  // default url
  let url = `https://${options.lang}.${options.wiki}.org/w/api.php?`
  // from a 3rd party wiki
  options.domain = options.domain || options.wikiUrl //support old syntax
  if (options.domain) {
    let path = options.path
    //wikimedia api uses ./w/api path. no others do
    if (isInterWiki.test(options.domain)) {
      path = 'w/api.php'
    }
    url = `https://${options.domain}/${path}?`
  }
  if (!options.follow_redirects) {
    delete params.redirects
  }
  // support numerical ids
  let page = options.title
  if (typeof page === 'number') {
    params.pageids = page //single pageId
  } else if (isArray(page) && typeof page[0] === 'number') {
    params.pageids = page.join('|') //pageid array
  } else if (isArray(page) === true) {
    //support array
    params.titles = page.map(cleanTitle).join('|')
  } else {
    // single page
    params.titles = cleanTitle(page)
  }
  // make it!
  url += toQueryString(params)
  return url
}
module.exports = makeUrl
