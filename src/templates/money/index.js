const pipeSplit = require('../_parsers/pipeSplit');

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
  'euro': '€',
  'nz$': 'NZ$',
  'nok': 'kr', //https://en.wikipedia.org/wiki/Template:NOK
  'aud': 'A$', //https://en.wikipedia.org/wiki/Template:AUD
  'zar': 'R', //https://en.wikipedia.org/wiki/Template:ZAR
};

const parseCurrency = (tmpl, r) => {
  let o = pipeSplit(tmpl, ['amount', 'code']);
  r.templates.push(o);
  let code = o.template || '';
  if (code === '' || code === 'currency') {
    code = o.code;
  }
  code = code.toLowerCase();
  let out = codes[code] || '';
  return `${out}${o.amount || ''}`;
};

const currencies = {
  //this one is generic https://en.wikipedia.org/wiki/Template:Currency
  currency: parseCurrency
};
//the others fit the same pattern..
Object.keys(codes).forEach((k) => {
  currencies[k] = parseCurrency;
});


module.exports = currencies;
