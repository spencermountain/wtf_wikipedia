const parse = require('../../../parse/toJSON')
const percentage = require('./_lib').percentage

let templates = {
  //
  inrconvert: (tmpl, list) => {
    let o = parse(tmpl, ['rupee_value', 'currency_formatting'])
    list.push(o)
    const mults = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
      t: 1000000000000,
      l: 100000,
      c: 10000000,
      lc: 1000000000000,
    }
    if (o.currency_formatting) {
      let multiplier = mults[o.currency_formatting] || 1
      o.rupee_value = o.rupee_value * multiplier
    }
    return `inr ${o.rupee_value || ''}`
  },

  //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
  percentage: (tmpl) => {
    let obj = parse(tmpl, ['numerator', 'denominator', 'decimals'])
    let num = percentage(obj)
    if (num === null) {
      return ''
    }
    return num + '%'
  },

  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  frac: (tmpl, list) => {
    let order = ['a', 'b', 'c']
    let obj = parse(tmpl, order)
    let data = {
      template: 'sfrac',
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

  // {{Percent-done|done=N|total=N|digits=N}}
  'percent-done': (tmpl) => {
    let obj = parse(tmpl, ['done', 'total', 'digits'])
    let num = percentage({
      numerator: obj.done,
      denominator: obj.total,
      decimals: obj.digits,
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
      decimals: 1,
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
      decimals: 1,
    })
    if (num === null) {
      return ''
    }
    num = `.${num * 10}`
    return `${wins || 0} || ${losses || 0} || ${num || '-'}`
  },
}

module.exports = templates
