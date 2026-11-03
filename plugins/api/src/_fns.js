import makeHeaders from './_headers.js'

export function normalize(title = '') {
  title = title.trim()
  title = title.replace(/ /g, '_')
  title = encodeURIComponent(title)
  return title
}

export const defaults = {
  lang: 'en',
  path: 'w/api.php',
}

const isWikimedia = /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary)\.org$/
const isBare = /^(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary)\.org$/

// the api's base-url. a fetched doc's options() store a bare project
// domain like 'wikipedia.org' + path 'api.php' - neither is usable alone
export function apiBase(options) {
  let { lang, domain, path } = options
  if (domain && isBare.test(domain) && lang) {
    domain = `${lang}.${domain}`
  }
  if (domain && isWikimedia.test(domain)) {
    path = 'w/api.php'
  }
  if (!domain) {
    return `https://${lang}.wikipedia.org/${path}?`
  }
  return `https://${domain}/${path}?`
}

export function toUrlParams(obj) {
  const arr = Object.entries(obj).map(([key, value]) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  })
  return arr.join('&')
}

export function fetchOne(url, options, http, prop) {
  const headers = makeHeaders(options)
  return http(url, headers, options.silent).then((res) => {
    const pages = Object.keys(res.query.pages || {})
    if (pages.length === 0) {
      return { pages: [], cursor: null }
    }
    return {
      pages: res.query.pages[pages[0]][prop] || [],
      cursor: res.continue,
    }
  })
}
