const languages = require('../../../_data/languages')

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

module.exports = {
  getLang: getLang,
}
