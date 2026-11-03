import fmtName from './toJSON/_fmtName.ts'
import { defaultWorld } from '../../../world/index.ts'

//some looser ones
const startReg = /^infobox /i
const endReg = / infobox$/i
const yearIn = /^year in [A-Z]/i

//some known ones from
//https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
//and https://en.wikipedia.org/wiki/Category:Infobox_templates
const isInfobox = function (name: string) {
  //known
  if (defaultWorld._cached.infoboxTemplates.has(name)) {
    return true
  }
  if (defaultWorld._cached.infoboxReg.test(name)) {
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
  return normalized.replace(defaultWorld._cached.infoboxReg, '').trim()
}

export { isInfobox, infoboxType }
