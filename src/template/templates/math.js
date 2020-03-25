const parse = require('../_parsers/parse')
// const parseSentence = require('../../04-sentence').fromText;

//simply num/denom * 100
const percentage = function(obj) {
  if (!obj.numerator && !obj.denominator) {
    return null
  }
  let perc = Number(obj.numerator) / Number(obj.denominator)
  perc *= 100
  let dec = Number(obj.decimals)
  if (isNaN(dec)) {
    dec = 1
  }
  perc = perc.toFixed(dec)
  return Number(perc)
}

let templates = {
  // https://en.wikipedia.org/wiki/Template:Math
  math: (tmpl, list) => {
    let obj = parse(tmpl, ['formula'])
    list.push(obj)
    return '\n\n' + (obj.formula || '') + '\n\n'
  },

  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  frac: (tmpl, list) => {
    let order = ['a', 'b', 'c']
    let obj = parse(tmpl, order)
    let data = {
      template: 'sfrac'
    }
    if (obj.c) {
      data.integer = obj.a
      data.numerator = obj.b
      data.denominator = obj.c
    } else if (obj.b) {
      data.numerator = obj.a
      data.denominator = obj.b
    } else {
      data.numerator = 1
      data.denominator = obj.a
    }
    list.push(data)
    if (data.integer) {
      return `${data.integer} ${data.numerator}⁄${data.denominator}`
    }
    return `${data.numerator}⁄${data.denominator}`
  },
  //https://en.wikipedia.org/wiki/Template:Radic
  radic: tmpl => {
    let order = ['after', 'before']
    let obj = parse(tmpl, order)
    return `${obj.before || ''}√${obj.after || ''}`
  },
  //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
  percentage: tmpl => {
    let obj = parse(tmpl, ['numerator', 'denominator', 'decimals'])
    let num = percentage(obj)
    if (num === null) {
      return ''
    }
    return num + '%'
  },
  // {{Percent-done|done=N|total=N|digits=N}}
  'percent-done': tmpl => {
    let obj = parse(tmpl, ['done', 'total', 'digits'])
    let num = percentage({
      numerator: obj.done,
      denominator: obj.total,
      decimals: obj.digits
    })
    if (num === null) {
      return ''
    }
    return `${obj.done} (${num}%) done`
  },
  'winning percentage': (tmpl, list) => {
    let obj = parse(tmpl, ['wins', 'losses', 'ties'])
    list.push(obj)
    let wins = Number(obj.wins)
    let losses = Number(obj.losses)
    let ties = Number(obj.ties) || 0
    let games = wins + losses + ties
    if (obj.ignore_ties === 'y') {
      ties = 0
    }
    if (ties) {
      wins += ties / 2
    }
    let num = percentage({
      numerator: wins,
      denominator: games,
      decimals: 1
    })
    if (num === null) {
      return ''
    }
    return `.${num * 10}`
  },
  winlosspct: (tmpl, list) => {
    let obj = parse(tmpl, ['wins', 'losses'])
    list.push(obj)
    let wins = Number(obj.wins)
    let losses = Number(obj.losses)
    let num = percentage({
      numerator: wins,
      denominator: wins + losses,
      decimals: 1
    })
    if (num === null) {
      return ''
    }
    num = `.${num * 10}`
    return `${wins || 0} || ${losses || 0} || ${num || '-'}`
  }
}
//aliases
templates['sfrac'] = templates.frac
templates['sqrt'] = templates.radic
templates['pct'] = templates.percentage
templates['percent'] = templates.percentage
templates['winpct'] = templates['winning percentage']
templates['winperc'] = templates['winning percentage']

module.exports = templates
