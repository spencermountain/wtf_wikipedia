const templates = {
  // https://en.wikinews.org/wiki/Template:W
  w: (tmpl, _list, parser) => {
    const obj = parser(tmpl, ['target', 'label'])
    if (obj.label) {
      return `[[${obj.target}|${obj.label}]]`
    }
    return `[[${obj.target}]]`
  },
  wikipedia: (tmpl, _list, parser) => {
    const obj = parser(tmpl, ['target', 'label'])
    if (obj.label) {
      return `[[${obj.target}|${obj.label}]]`
    }
    return `[[${obj.target}]]`
  },
  'km to mi': (tmpl, _list, parser) => {
    const obj = parser(tmpl, ['km'])
    const num = Number(obj.km) || 0
    let m = num * 0.62137
    m = Math.round(m * 10) / 10
    if (!m) {
      return `${obj.km} km`
    }
    return `${obj.km} km (${m} mi)`
  },
  'mi to km': (tmpl, _list, parser) => {
    const obj = parser(tmpl, ['mi'])
    const num = Number(obj.mi) || 0
    let m = num * 1.609344
    m = Math.round(m * 10) / 10
    return `${obj.mi} mi (${m} km)`
  },
}
templates.wikipediapar = templates.wikipedia
export default templates
