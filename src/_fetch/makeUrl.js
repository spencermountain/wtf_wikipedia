import { isArray } from '../_lib/helpers.js'

const isInterWiki =
  /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/

const defaults = {
  action: 'query',
  prop: 'revisions|pageprops', // we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  rvprop: 'content|ids|timestamp',
  maxlag: 5,
  rvslots: 'main',
  origin: '*',
  format: 'json',
  redirects: 'true',
}

/**
 * turns a object into a query string
 *
 * @private
 * @param {Object<string, string | number | boolean>} obj
 * @returns {string} QueryString
 */
const toQueryString = function (obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * cleans and prepares the tile by replacing the spaces with underscores (_) and trimming the white spaces of the ends
 *
 * @private
 * @param {string} page the title that needs cleaning
 * @returns {string} the cleaned title
 */
const cleanTitle = (page) => {
  return page.replace(/ /g, '_').trim()
}

/**
 * generates the url for fetching the pages
 *
 * @private
 * @param {import('.').fetchDefaults} options
 * @param {Object} [parameters]
 * @returns {string} the url that can be used to make the fetch
 */
const makeUrl = function (options, parameters = defaults) {
  let params = Object.assign({}, parameters)

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
