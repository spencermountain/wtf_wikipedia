const parse = require('../_parsers/parse')

const codes = {
  us$: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  bdt: '৳', // https://en.wikipedia.org/wiki/Template:BDT
  a$: 'A$', // https://en.wikipedia.org/wiki/Template:AUD
  ca$: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  cad: 'CA$',
  cny: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  hkd: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  gbp: 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  '₹': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  '¥': '¥', // https://en.wikipedia.org/wiki/Template:JPY
  jpy: '¥',
  yen: '¥',
  '₱': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  pkr: '₨', // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
  '€': '€', // https://en.wikipedia.org/wiki/Template:€
  euro: '€',
  nz$: 'NZ$',
  nok: 'kr', //https://en.wikipedia.org/wiki/Template:NOK
  aud: 'A$', //https://en.wikipedia.org/wiki/Template:AUD
  zar: 'R' //https://en.wikipedia.org/wiki/Template:ZAR
}

const parseCurrency = (tmpl, r) => {
  let o = parse(tmpl, ['amount', 'code'])
  r.templates.push(o)
  let code = o.template || ''
  if (code === '' || code === 'currency' || code === 'monnaie' || code === 'unité' || code === 'nombre' || code === 'nb') {
    code = o.code
  }
  code = (code || '').toLowerCase()
  let out = codes[code] || ''
  let str = `${out}${o.amount || ''}`
  //support unknown currencies after the number - like '5 BTC'
  if (o.code && !codes[o.code.toLowerCase()]) {
    str += ' ' + o.code
  }
  return str
}

const inrConvert = (tmpl, r) => {
  let o = parse(tmpl, ['rupee_value', 'currency_formatting'])
  r.templates.push(o)
  let formatting = o.currency_formatting
  if (formatting) {
	let multiplier = 1;
    switch(formatting) {
      case 'k':
        multiplier = 1000;
        break;
      case 'm':
        multiplier = 1000000;
        break;
      case 'b':
        multiplier = 1000000000;
        break;
      case 't':
        multiplier = 1000000000000;
        break;
      case 'l':
        multiplier = 100000;
        break;
      case 'c':
        multiplier = 10000000;
        break;
      case 'lc':
        multiplier = 1000000000000;
        break;
    }
    o.rupee_value = o.rupee_value * multiplier
	
  }
  let str = `inr ${o.rupee_value || ''}`
  return str
}

const currencies = {
  //this one is generic https://en.wikipedia.org/wiki/Template:Currency
  currency: parseCurrency,
  monnaie: parseCurrency,
  unité: parseCurrency,
  nombre: parseCurrency,
  nb: parseCurrency,
  inrconvert: inrConvert
}
//the others fit the same pattern..
Object.keys(codes).forEach(k => {
  currencies[k] = parseCurrency
})

module.exports = currencies
