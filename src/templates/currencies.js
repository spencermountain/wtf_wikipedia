const pipeSplit = require('./parsers/pipeSplit');

const currencyTemplateCodes = {
  us$: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  bdt: '৳', // https://en.wikipedia.org/wiki/Template:BDT
  a$: 'A$', // https://en.wikipedia.org/wiki/Template:AUD
  ca$: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  cny: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  hkd: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  gbp: 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  '₹': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  '¥': '¥', // https://en.wikipedia.org/wiki/Template:JPY
  jpy: '¥',
  yen: '¥',
  '₱': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  pkr: '₨', // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
};

const templateForCurrency = currency => tmpl => {
  const {year, value} = pipeSplit(tmpl, ['value', 'year']);
  // Ignore round, about, link options
  if (year) {
    // Don't perform inflation adjustment
    return `${currency}${value} (${year})`;
  }
  if (value) {
    return `${currency}${value}`;
  }
  return currency;
};

const currencies = Object.keys(currencyTemplateCodes).reduce(
  (result, code) => {
    result[code] = templateForCurrency(currencyTemplateCodes[code]);
    return result;
  },
  {
    // https://en.wikipedia.org/wiki/Template:Currency
    currency: tmpl => {
      // Ignore first and linked options
      const {code, amount} = pipeSplit(tmpl, ['amount', 'code']);
      return `${code}${amount}`;
    },
  }
);

module.exports = currencies;
