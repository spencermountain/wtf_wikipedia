const parse = require('../_parsers/parse')

const codes = {
  bdt: '৳', // https://en.wikipedia.org/wiki/Template:BDT
  a$: 'A$', // https://en.wikipedia.org/wiki/Template:AUD
  aud: 'A$', //https://en.wikipedia.org/wiki/Template:AUD
  au$: 'A$', //https://en.wikipedia.org/wiki/Template:AUD
  bdt: 'BDT', //https://en.wikipedia.org/wiki/Template:BDT
  brl: 'BRL', //https://en.wikipedia.org/wiki/Template:BRL
  r$: 'BRL', //https://en.wikipedia.org/wiki/Template:BRL
  ca$: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  cad: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  chf: 'CHF', // https://en.wikipedia.org/wiki/Template:CHF
  sfr: 'CHF', // https://en.wikipedia.org/wiki/Template:CHF
  cny: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  'cn¥': 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  czk: 'czk', // https://en.wikipedia.org/wiki/Template:CZK
  dkk: 'dkk', // https://en.wikipedia.org/wiki/Template:DKK
  dkk2: 'dkk', // https://en.wikipedia.org/wiki/Template:DKK
  '€': '€', // https://en.wikipedia.org/wiki/Template:€
  euro: '€', // https://en.wikipedia.org/wiki/Template:€
  gbp: 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  'gb£': 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  '£': 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  hkd: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  hk$: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  ils: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  '₹': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  inr: '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'india rs': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupee symbol': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupees': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupee': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  '¥': '¥', // https://en.wikipedia.org/wiki/Template:JPY
  jpy: '¥', // https://en.wikipedia.org/wiki/Template:JPY
  yen: '¥', // https://en.wikipedia.org/wiki/Template:JPY
  '₩': '₩', // https://en.wikipedia.org/wiki/Template:SK_won
  myr: 'MYR', // https://en.wikipedia.org/wiki/Template:MYR
  ils: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  nis: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  shekel: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  sheqel: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  nok: 'NOK', //https://en.wikipedia.org/wiki/Template:NOK
  nok2: 'NOK', //https://en.wikipedia.org/wiki/Template:NOK
  nz$: 'NZ$', //https://en.wikipedia.org/wiki/Template:NZD
  nzd: 'NZ$', //https://en.wikipedia.org/wiki/Template:NZD
  peso: 'peso', //https://en.wikipedia.org/wiki/Template:Peso
  '₱': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  'philippine peso': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  pkr: '₨', // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
  rmb: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  rub: '₽', // https://en.wikipedia.org/wiki/Template:RUB
  '₽': '₽', // https://en.wikipedia.org/wiki/Template:RUB
  ruble: '₽', // https://en.wikipedia.org/wiki/Template:Ruble
  rupee: '₹', // https://en.wikipedia.org/wiki/Template:Rupee
  'russian ruble': '₽', // https://en.wikipedia.org/wiki/Template:Russian_ruble
  sek: 'SEK', // https://en.wikipedia.org/wiki/Template:SEK
  sek2: 'SEK', // https://en.wikipedia.org/wiki/Template:SEK
  sgd: 'sgd', // https://en.wikipedia.org/wiki/Template:SGD
  s$: 'sgd', // https://en.wikipedia.org/wiki/Template:SGD
  'SK won': '₩', // https://en.wikipedia.org/wiki/Template:SK_won
  ttd: 'TTD', //https://en.wikipedia.org/wiki/Template:TTD
  'turkish lira': 'TRY', //https://en.wikipedia.org/wiki/Template:Turkish_lira
  us$: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  usd: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  zar: 'R' //https://en.wikipedia.org/wiki/Template:ZAR
}

const parseCurrency = (tmpl, r) => {
  let o = parse(tmpl, ['amount', 'code'])
  r.templates.push(o)
  let code = o.template || ''
  if (code === 'currency') {
    code = o.code
    if (!code) {
      o.code = code = 'usd' //Special case when currency template has no code argument
    }
  } else if (
    code === '' ||
    code === 'monnaie' ||
    code === 'unité' ||
    code === 'nombre' ||
    code === 'nb'
  ) {
    code = o.code
  }
  code = (code || '').toLowerCase()
  switch (code) {
    case 'us':
      o.code = code = 'usd'
      break
    case 'uk':
      o.code = code = 'gbp'
      break
  }
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
    let multiplier = 1
    switch (formatting) {
      case 'k':
        multiplier = 1000
        break
      case 'm':
        multiplier = 1000000
        break
      case 'b':
        multiplier = 1000000000
        break
      case 't':
        multiplier = 1000000000000
        break
      case 'l':
        multiplier = 100000
        break
      case 'c':
        multiplier = 10000000
        break
      case 'lc':
        multiplier = 1000000000000
        break
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
  iso4217: parseCurrency,
  inrconvert: inrConvert
}
//the others fit the same pattern..
Object.keys(codes).forEach(k => {
  currencies[k] = parseCurrency
})

module.exports = currencies
