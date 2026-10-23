import infoboxList from '../../../_data/infoboxes.ts'
import fmtName from './toJSON/_fmtName.ts'
import { infoboxes } from '../../../_data/i18n/index.ts'
const i18nReg = new RegExp('^(subst.)?(' + infoboxes.join('|') + ')(?=:| |\n|$)', 'i')
infoboxes.forEach((name) => {
  infoboxList[name] = true
})

//some looser ones
const startReg = /^infobox /i
const endReg = / infobox$/i
const yearIn = /^year in [A-Z]/i

//some known ones from
//https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
//and https://en.wikipedia.org/wiki/Category:Infobox_templates
const isInfobox = function (name: string) {
  //known
  if (Object.hasOwn(infoboxList, name) === true) {
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

// Preserve the legacy Infobox.type() accessor without adding root metadata.
const infoboxType = (name: string) => {
  const normalized = fmtName(name)
  return normalized.replace(i18nReg, '').trim()
}

export { isInfobox, infoboxType }
