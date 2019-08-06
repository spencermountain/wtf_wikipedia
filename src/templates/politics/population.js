const parse = require('../_parsers/parse')

let templates = {
  //https://en.wikipedia.org/wiki/Template:Historical_populations
  'historical populations': (tmpl, r) => {
    let data = parse(tmpl)
    data.list = data.list || []
    let years = []
    for (let i = 0; i < data.list.length; i += 2) {
      let num = data.list[i + 1]
      years.push({
        year: data.list[i],
        val: Number(num) || num
      })
    }
    data.data = years
    delete data.list
    r.templates.push(data)
    return ''
  }
}
module.exports = templates
