const i18n = require('../_data/i18n')
const i18nReg = new RegExp(
  '^(subst.)?(' + i18n.infoboxes.join('|') + ')[: \n]',
  'i'
)
//some looser ones
const startReg = /^infobox /i
const endReg = / infobox$/i
const yearIn = /$Year in [A-Z]/i

//some known ones from
// https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
// and https://en.wikipedia.org/wiki/Category:Infobox_templates
const known = {
  'gnf protein box': true,
  'automatic taxobox': true,
  'chembox ': true,
  editnotice: true,
  geobox: true,
  hybridbox: true,
  ichnobox: true,
  infraspeciesbox: true,
  mycomorphbox: true,
  oobox: true,
  'paraphyletic group': true,
  speciesbox: true,
  subspeciesbox: true,
  'starbox short': true,
  taxobox: true,
  nhlteamseason: true,
  'asian games bid': true,
  'canadian federal election results': true,
  'dc thomson comic strip': true,
  'daytona 24 races': true,
  edencharacter: true,
  'moldova national football team results': true,
  samurai: true,
  protein: true,
  'sheet authority': true,
  'order-of-approx': true,
  'bacterial labs': true,
  'medical resources': true,
  ordination: true,
  'hockey team coach': true,
  'hockey team gm': true,
  'pro hockey team': true,
  'hockey team player': true,
  'hockey team start': true,
  mlbbioret: true,
}
//
const isInfobox = function (name) {
  // known
  if (known.hasOwnProperty(name) === true) {
    return true
  }
  if (i18nReg.test(name)) {
    return true
  }
  if (startReg.test(name) || endReg.test(name)) {
    return true
  }
  //these are also infoboxes: 'Year in Belarus'
  if (yearIn.test(name)) {
    return true
  }
  return false
}

//turns template data into good inforbox data
const fmtInfobox = function (obj = {}) {
  let m = obj.template.match(i18nReg)
  let type = obj.template
  if (m && m[0]) {
    type = type.replace(m[0], '')
  }
  type = type.trim()
  let infobox = {
    template: 'infobox',
    type: type,
    data: obj,
  }
  delete infobox.data.template // already have this.
  delete infobox.data.list //just in case!
  return infobox
}

module.exports = {
  isInfobox: isInfobox,
  format: fmtInfobox,
}
