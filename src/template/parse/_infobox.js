import infoboxList from '../../infobox/_infoboxes.js'
import { infoboxes } from '../../_data/i18n.js'
const i18nReg = new RegExp('^(subst.)?(' + infoboxes.join('|') + ')(?=:| |\n|$)', 'i')
infoboxes.forEach(name => {
  infoboxList[name] = true
})

//some looser ones
const startReg = /^infobox /i
const endReg = / infobox$/i
const yearIn = /^year in [A-Z]/i

//some known ones from
//https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
//and https://en.wikipedia.org/wiki/Category:Infobox_templates
const isInfobox = function (name) {
  //known
  if (infoboxList.hasOwnProperty(name) === true) {
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

//turns template data into good infobox data
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
  delete infobox.data.template //already have this.
  delete infobox.data.list //just in case!
  return infobox
}

export { isInfobox, fmtInfobox }
