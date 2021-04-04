const templates = {
  // https://en.wikinews.org/wiki/Template:W
  w: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['target', 'label'])
    if (obj.label) {
      return `[[${obj.target}|${obj.label}]]`
    }
    return `[[${obj.target}]]`
  },
  wikipedia: (tmpl, list, parser) => {
    let obj = parser(tmpl, ['target', 'label'])
    if (obj.label) {
      return `[[${obj.target}|${obj.label}]]`
    }
    return `[[${obj.target}]]`
  },
  'km to mi': (tmpl, list, parser) => {
    let obj = parser(tmpl, ['km'])
    let num = Number(obj.km) || 0
    let m = num * 0.62137
    m = Math.round(m * 10) / 10
    if (!m) {
      return `${obj.km} km`
    }
    return `${obj.km} km (${m} mi)`
  },
  'mi to km': (tmpl, list, parser) => {
    let obj = parser(tmpl, ['mi'])
    let num = Number(obj.mi) || 0
    let m = num * 1.609344
    m = Math.round(m * 10) / 10
    return `${obj.mi} mi (${m} km)`
  },
}
templates.wikipediapar = templates.wikipedia
module.exports = templates
