import languages from '../../_data/languages.js'

//simply num/denom * 100
function percentage (obj) {
  if (!obj.numerator && !obj.denominator) {
    return null
  }
  let perc = Number(obj.numerator) / Number(obj.denominator)
  perc *= 100
  let dec = Number(obj.decimals)
  if (isNaN(dec)) {
    dec = 1
  }
  return Number(perc.toFixed(dec))
}

function toNumber (str = '') {
  if (typeof str === 'number') {
    return str
  }
  str = str.replace(/,/g, '')
  str = str.replace(/−/g, '-')
  let num = Number(str)
  if (isNaN(num)) {
    return str
  }
  return num
}

function getLang (name) {
  //grab the language from the template name - 'ipa-de'
  let lang = name.match(/ipac?-(.+)/)
  if (lang !== null) {
    if (languages.hasOwnProperty(lang[1]) === true) {
      return languages[lang[1]].english_title
    }
    return lang[1]
  }
  return null
}

function titlecase (str) {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

const sisterProjects = {
  wikt: 'wiktionary',
  commons: 'commons',
  c: 'commons',
  commonscat: 'commonscat',
  n: 'wikinews',
  q: 'wikiquote',
  s: 'wikisource',
  a: 'wikiauthor',
  b: 'wikibooks',
  voy: 'wikivoyage',
  v: 'wikiversity',
  d: 'wikidata',
  species: 'wikispecies',
  m: 'meta',
  mw: 'mediawiki',
}

export {
  titlecase,
  sisterProjects,
  getLang,
  percentage,
  toNumber,
}
