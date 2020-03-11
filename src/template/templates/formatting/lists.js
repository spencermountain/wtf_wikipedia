const strip = require('../../_parsers/_strip')
const parse = require('../../_parsers/parse')

const tmpls = {
  //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: tmpl => {
    tmpl = strip(tmpl)
    //remove the title
    let arr = tmpl.split('|')
    arr = arr.slice(1)
    tmpl = arr.join('|')
    //split on newline
    arr = tmpl.split(/\n ?\* ?/)
    arr = arr.filter(s => s)
    return arr.join('\n\n')
  },

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
    obj.list = obj.list.filter(s => s)
    str += obj.list.join('\n\n')
    return str
  },
  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    obj.list = obj.list || []
    let lines = obj.list.map((str, i) => `${i + 1}. ${str}`)
    return lines.join('\n\n')
  },
  hlist: tmpl => {
    let obj = parse(tmpl)
    obj.list = obj.list || []
    return obj.list.join(' · ')
  },
  pagelist: tmpl => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },
  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  catlist: tmpl => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },
  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  'br separated entries': tmpl => {
    let arr = parse(tmpl).list || []
    return arr.join('\n\n')
  },
  'comma separated entries': tmpl => {
    let arr = parse(tmpl).list || []
    return arr.join(', ')
  },
  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  'anchored list': tmpl => {
    let arr = parse(tmpl).list || []
    arr = arr.map((str, i) => `${i + 1}. ${str}`)
    return arr.join('\n\n')
  },
  'bulleted list': tmpl => {
    let arr = parse(tmpl).list || []
    arr = arr.filter(f => f)
    arr = arr.map(str => '• ' + str)
    return arr.join('\n\n')
  },
  //https://en.wikipedia.org/wiki/Template:Columns-list
  'columns-list': (tmpl, list) => {
    let arr = parse(tmpl).list || []
    let str = arr[0] || ''
    let lines = str.split(/\n/)
    lines = lines.filter(f => f)
    lines = lines.map(s => s.replace(/\*/, ''))
    list.push({
      template: 'columns-list',
      list: lines
    })
    lines = lines.map(s => '• ' + s)
    return lines.join('\n\n')
  }
  // 'pagelist':(tmpl)=>{},
}
//aliases
tmpls.flatlist = tmpls.plainlist
tmpls.ublist = tmpls.plainlist
tmpls['unbulleted list'] = tmpls['collapsible list']
tmpls['ubl'] = tmpls['collapsible list']
tmpls['bare anchored list'] = tmpls['anchored list']
tmpls['plain list'] = tmpls['plainlist']
tmpls.cmn = tmpls['columns-list']
tmpls.collist = tmpls['columns-list']
tmpls['col-list'] = tmpls['columns-list']
tmpls.columnslist = tmpls['columns-list']
module.exports = tmpls
