import { isArray } from '../../_lib/helpers.ts'

const isInterWiki =
  /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/

const defaults = {
  action: 'query',
  // we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  // 'description' is the central wikidata one - wikis without that extension warn, and skip it
  prop: 'revisions|pageprops|description',
  rvprop: 'content|ids|timestamp',
  maxlag: 5, //timeout in seconds
  rvslots: 'main',
  origin: '*',
  format: 'json',
  formatversion: 2, //cleaner response format - wikis older than 2015 ignore it, and return v1
  redirects: 'true',
}

const toQueryString = function (obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
    .join('&')
}

const cleanTitle = (page) => {
  return page.replace(/ /g, '_').trim()
}

const makeUrl = function (options, parameters = defaults) {
  let params: any = { ...parameters }

  //default url
  let apiPath = ''

  //add support for third party apis
  if (options.domain) {
    //wikimedia is the only api that uses `/w/api` as its path. other wikis use other paths
    let path = isInterWiki.test(options.domain) ? 'w/api.php' : options.path
    apiPath = `https://${options.domain}/${path}?`
  } else if (options.lang && options.wiki) {
    apiPath = `https://${options.lang}.${options.wiki}.org/w/api.php?`
  } else {
    return ''
  }

  if (!options.follow_redirects) {
    delete params.redirects
  }

  // the origin header and url parameters need to be the same
  // if one is provided we should change both the header and the parameter
  if (options.origin) {
    params.origin = options.origin
  }

  //support numerical ids
  let title = options.title
  if (typeof title === 'number') {
    //single pageId
    params.pageids = title
  } else if (typeof title === 'string') {
    //single page title
    params.titles = cleanTitle(title)
  } else if (title !== undefined && isArray(title) && typeof title[0] === 'number') {
    //pageid array
    params.pageids = title.filter((t) => t).join('|')
  } else if (title !== undefined && isArray(title) === true && typeof title[0] === 'string') {
    //title array
    params.titles = title
      .filter((t) => t)
      .map(cleanTitle)
      .join('|')
  } else {
    return ''
  }

  //make it!
  return `${apiPath}${toQueryString(params)}`
}
export default makeUrl
