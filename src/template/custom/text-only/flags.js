import parse from '../../parse/toJSON/index.js'
import flags from '../../../_data/flags.js'
const order = ['flag', 'variant']
let templates = {
  //https://en.wikipedia.org/wiki/Template:Flag
  // {{flag|USA}} →  USA
  flag: (tmpl) => {
    let obj = parse(tmpl, order)
    let name = obj.flag || ''
    obj.flag = (obj.flag || '').toLowerCase()
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || []
    let flag = found[0] || ''
    return `${flag} [[${found[2]}|${name}]]`
  },
  // {{flagcountry|USA}} →  United States
  flagcountry: (tmpl) => {
    let obj = parse(tmpl, order)
    obj.flag = (obj.flag || '').toLowerCase()
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || []
    let flag = found[0] || ''
    return `${flag} [[${found[2]}]]`
  },
  // (unlinked flag-country)
  flagcu: (tmpl) => {
    let obj = parse(tmpl, order)
    obj.flag = (obj.flag || '').toLowerCase()
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || []
    let flag = found[0] || ''
    return `${flag} ${found[2]}`
  },
  //https://en.wikipedia.org/wiki/Template:Flagicon
  // {{flagicon|USA}} → United States
  flagicon: (tmpl) => {
    let obj = parse(tmpl, order)
    obj.flag = (obj.flag || '').toLowerCase()
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2])
    if (!found) {
      return ''
    }
    return `[[${found[2]}|${found[0]}]]`
  },
  //unlinked flagicon
  flagdeco: (tmpl) => {
    let obj = parse(tmpl, order)
    obj.flag = (obj.flag || '').toLowerCase()
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2]) || []
    return found[0] || ''
  },
  //same, but a soccer team
  fb: (tmpl) => {
    let obj = parse(tmpl, order)
    obj.flag = (obj.flag || '').toLowerCase()
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2])
    if (!found) {
      return ''
    }
    return `${found[0]} [[${found[2]} national football team|${found[2]}]]`
  },
  fbicon: (tmpl) => {
    let obj = parse(tmpl, order)
    obj.flag = (obj.flag || '').toLowerCase()
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2])
    if (!found) {
      return ''
    }
    return ` [[${found[2]} national football team|${found[0]}]]`
  },
  flagathlete: (tmpl) => {
    let obj = parse(tmpl, ['name', 'flag', 'variant'])
    obj.flag = (obj.flag || '').toLowerCase()
    let found = flags.find((a) => obj.flag === a[1] || obj.flag === a[2])
    if (!found) {
      return `[[${obj.name || ''}]]`
    }
    return `${found[0]} [[${obj.name || ''}]] (${found[1].toUpperCase()})`
  },
}
//support {{can}}
flags.forEach((a) => {
  templates[a[1]] = () => {
    return a[0]
  }
})
export default templates
