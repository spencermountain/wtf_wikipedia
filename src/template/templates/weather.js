const parse = require('../_parsers/parse')
const hasMonth = /^jan /i
const isYear = /^year /i

const monthList = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
]

const toNumber = function(str) {
  str = str.replace(/,/g, '')
  str = str.replace(/−/g, '-')
  let num = Number(str)
  if (isNaN(num)) {
    return str
  }
  return num
}

let templates = {
  // this one is a handful!
  //https://en.wikipedia.org/wiki/Template:Weather_box
  'weather box': (tmpl, list) => {
    let obj = parse(tmpl)
    //collect all month-based data
    let byMonth = {}
    let properties = Object.keys(obj).filter(k => hasMonth.test(k))
    properties = properties.map(k => k.replace(hasMonth, ''))
    properties.forEach(prop => {
      byMonth[prop] = []
      monthList.forEach(m => {
        let key = `${m} ${prop}`
        if (obj.hasOwnProperty(key)) {
          let num = toNumber(obj[key])
          delete obj[key]
          byMonth[prop].push(num)
        }
      })
    })
    //add these to original
    obj.byMonth = byMonth

    //collect year-based data
    let byYear = {}
    Object.keys(obj).forEach(k => {
      if (isYear.test(k)) {
        let prop = k.replace(isYear, '')
        byYear[prop] = obj[k]
        delete obj[k]
      }
    })
    obj.byYear = byYear

    list.push(obj)
    return ''
  },

  //The 36 parameters are: 12 monthly highs (C), 12 lows (total 24) plus an optional 12 monthly rain/precipitation
  //https://en.wikipedia.org/wiki/Template:Weather_box/concise_C
  'weather box/concise c': (tmpl, list) => {
    let obj = parse(tmpl)
    obj.list = obj.list.map(s => toNumber(s))
    obj.byMonth = {
      'high c': obj.list.slice(0, 12),
      'low c': obj.list.slice(12, 24),
      'rain mm': obj.list.slice(24, 36)
    }
    delete obj.list
    obj.template = 'weather box'
    list.push(obj)
    return ''
  },
  'weather box/concise f': (tmpl, list) => {
    let obj = parse(tmpl)
    obj.list = obj.list.map(s => toNumber(s))
    obj.byMonth = {
      'high f': obj.list.slice(0, 12),
      'low f': obj.list.slice(12, 24),
      'rain inch': obj.list.slice(24, 36)
    }
    delete obj.list
    obj.template = 'weather box'
    list.push(obj)
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Climate_chart
  'climate chart': (tmpl, list) => {
    let lines = parse(tmpl).list || []
    let title = lines[0]
    let source = lines[38]
    lines = lines.slice(1)
    //amazingly, they use '−' symbol here instead of negatives...
    lines = lines.map(str => {
      if (str && str[0] === '−') {
        str = str.replace(/−/, '-')
      }
      return str
    })
    let months = []
    //groups of three, for 12 months
    for (let i = 0; i < 36; i += 3) {
      months.push({
        low: toNumber(lines[i]),
        high: toNumber(lines[i + 1]),
        precip: toNumber(lines[i + 2])
      })
    }
    let obj = {
      template: 'climate chart',
      data: {
        title: title,
        source: source,
        months: months
      }
    }
    list.push(obj)
    return ''
  }
}

module.exports = templates
