const languages = require('../../../_data/languages')

//simply num/denom * 100
const percentage = function (obj) {
  if (!obj.numerator && !obj.denominator) {
    return null
  }
  let perc = Number(obj.numerator) / Number(obj.denominator)
  perc *= 100
  let dec = Number(obj.decimals)
  if (isNaN(dec)) {
    dec = 1
  }
  perc = perc.toFixed(dec)
  return Number(perc)
}

const toNumber = function (str = '') {
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

const getLang = function (name) {
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

const titlecase = (str) => {
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

module.exports = {
  titlecase: titlecase,
  sisterProjects: sisterProjects,
  getLang: getLang,
  percentage: percentage,
  toNumber: toNumber,
}
