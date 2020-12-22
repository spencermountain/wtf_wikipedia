const parse = require('../../_parsers/parse')

const tmpls = {
  //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    let str = ''
    if (obj.title) {
      str += `'''${obj.title}'''` + '\n\n'
    }
    if (!obj.list) {
      obj.list = []
      for (let i = 1; i < 10; i += 1) {
        if (obj[i]) {
          obj.list.push(obj[i])
          delete obj[i]
        }
      }
    }
    obj.list = obj.list.filter((s) => s)
    str += obj.list.join('\n\n')
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Columns-list
  'columns-list': (tmpl, list) => {
    let arr = parse(tmpl).list || []
    let str = arr[0] || ''
    let lines = str.split(/\n/).filter((f) => f)
    lines = lines.map((s) => s.replace(/\*/, ''))
    list.push({
      template: 'columns-list',
      list: lines,
    })
    lines = lines.map((s) => '• ' + s)
    return lines.join('\n\n')
  },
}

module.exports = tmpls
