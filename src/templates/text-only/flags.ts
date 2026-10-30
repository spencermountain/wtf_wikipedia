import defaultParse from '../../parse/templates/parse/toJSON/text.ts'
import flags from '../../_data/flags.ts'
import codeAliases from '../../_data/flag-aliases.ts'
const order = ['flag', 'variant']
// 'united states' → 'United States'
const titleCase = (str = '') => str.replace(/(^|[\s\-(])(\p{L})/gu, (m, pre, ch) => pre + ch.toUpperCase())
// by ISO-3 code, IOC/FIFA code, or country name
const findFlag = (code = '') => {
  code = code.toLowerCase().trim()
  code = codeAliases[code] || code
  return flags.find((a) => code === a[1] || code === a[2])
}
let templates = {
  //https://en.wikipedia.org/wiki/Template:Flag
  // {{flag|USA}} →  USA
  flag: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, order)
    let name = obj.flag || ''
    let found = findFlag(obj.flag) || []
    let flag = found[0] || ''
    return { data: null, replacement: `${flag} [[${found[2]}|${name}]]` }
  },
  // {{flagcountry|USA}} →  United States
  flagcountry: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, order)
    let found = findFlag(obj.flag)
    if (!found) {
      return { data: null, replacement: obj.flag || '' }
    }
    return { data: null, replacement: `${found[0]} [[${titleCase(found[2])}]]` }
  },
  // (unlinked flag-country)
  flagcu: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, order)
    let found = findFlag(obj.flag)
    if (!found) {
      return { data: null, replacement: obj.flag || '' }
    }
    return { data: null, replacement: `${found[0]} ${titleCase(found[2])}` }
  },
  //https://en.wikipedia.org/wiki/Template:Flagicon
  // {{flagicon|USA}} → United States
  flagicon: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, order)
    let found = findFlag(obj.flag)
    if (!found) {
      return { data: null, replacement: '' }
    }
    return { data: null, replacement: `[[${found[2]}|${found[0]}]]` }
  },
  //unlinked flagicon
  flagdeco: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, order)
    let found = findFlag(obj.flag) || []
    return { data: null, replacement: found[0] || '' }
  },
  //same, but a soccer team
  fb: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, order)
    let found = findFlag(obj.flag)
    if (!found) {
      return { data: null, replacement: '' }
    }
    return {
      data: null,
      replacement: `${found[0]} [[${titleCase(found[2])} national football team|${titleCase(found[2])}]]`,
    }
  },
  fbicon: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, order)
    let found = findFlag(obj.flag)
    if (!found) {
      return { data: null, replacement: '' }
    }
    return { data: null, replacement: ` [[${found[2]} national football team|${found[0]}]]` }
  },
  flagathlete: (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl, ['name', 'flag', 'variant'])
    let found = findFlag(obj.flag)
    if (!found) {
      return { data: null, replacement: `[[${obj.name || ''}]]` }
    }
    return { data: null, replacement: `${found[0]} [[${obj.name || ''}]] (${found[1].toUpperCase()})` }
  },
}
//support {{can}} - these are spread first in ./index.ts, so any real template with the same name wins
flags.forEach((a) => {
  if (Object.hasOwn(templates, a[1])) {
    return
  }
  templates[a[1]] = () => {
    return { data: null, replacement: a[0] }
  }
})
export { findFlag, titleCase }
export default templates
