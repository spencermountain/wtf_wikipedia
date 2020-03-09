const languages = require('../../_data/languages')
const parse = require('../_parsers/parse')

const templates = {
  lang: 1,
  //this one has a million variants
  'lang-de': 0,
  'rtl-lang': 1,
  //german keyboard letterscn
  taste: 0,
  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: (tmpl, list) => {
    let obj = parse(tmpl, ['english', 'kanji', 'romaji', 'extra'])
    list.push(obj)
    let str = obj.english || obj.romaji || ''
    if (obj.kanji) {
      str += ` (${obj.kanji})`
    }
    return str
  }
}
//https://en.wikipedia.org/wiki/Category:Lang-x_templates
Object.keys(languages).forEach(k => {
  templates['lang-' + k] = templates['lang-de']
})
templates['nihongo2'] = templates.nihongo
templates['nihongo3'] = templates.nihongo
templates['nihongo-s'] = templates.nihongo
templates['nihongo foot'] = templates.nihongo
module.exports = templates
