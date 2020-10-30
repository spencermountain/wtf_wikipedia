const test = require('tape')
const wtf = require('./lib')

test('currency-templates', function (t) {
  let doc = wtf('hello {{GBP|123.45}} world.')
  t.equal(doc.text(), 'hello GB£123.45 world.', 'gbp')

  doc = wtf('and now {{US$|21.20&nbsp;billion}}')
  t.equal(doc.text(), 'and now US$21.20 billion', 'usd')

  doc = wtf('{{Currency|1,000|JPY}} world')
  t.equal(doc.text(), '¥1,000 world', 'currency yen')
  t.equal(doc.templates().length, 1, 'got a template')
  t.equal(doc.templates(0).amount, '1,000', 'got template amount')

  doc = wtf('{{Currency|1000|USD}}')
  t.equal(doc.text(), 'US$1000', 'currency named parameters')

  doc = wtf('{{Currency|1000|US}}')
  t.equal(doc.text(), 'US$1000', 'currency named parameters')

  doc = wtf('{{currency|1.28 billion}}')
  t.equal(doc.text(), 'US$1.28 billion', 'currency uses US$ by default')

  doc = wtf('hello {{ZAR}} world')
  t.equal(doc.text(), 'hello R world', 'empty currency')

  doc = wtf('{{Unité|107.70|M€}}')
  t.equal(doc.text(), '107.70 M€', 'french unit 2 parameters')

  doc = wtf('{{Unité|107.70}}')
  t.equal(doc.text(), '107.70', 'french unit 1 parameter')

  doc = wtf('{{monnaie|107.70|€}}')
  t.equal(doc.text(), '€107.70', 'french monnaie 2 parameters')

  doc = wtf('{{nombre|107.70 M€}}')
  t.equal(doc.text(), '107.70 M€', 'french nombre 1 parameter')

  doc = wtf('{{nombre|107.70|M€}}')
  t.equal(doc.text(), '107.70 M€', 'french nombre 2 parameters M€')

  doc = wtf('{{nombre|107.70|€}}')
  t.equal(doc.text(), '€107.70', 'french nombre 2 parameters €')

  doc = wtf('{{nombre|107.70|euro}}')
  t.equal(doc.text(), '€107.70', 'french nombre 2 parameters euro')

  doc = wtf('{{nb|107.70|€}}')
  t.equal(doc.text(), '€107.70', 'french nombre 2 parameters')

  doc = wtf('{{iso4217|AUD}}')
  t.equal(doc.text(), 'AUD', 'iso4217 AUD')

  doc = wtf('{{indian rupee symbol}}')
  t.equal(doc.text(), '₹', 'indian rupee symbol')

  doc = wtf('{{currency|123.45|MYR}}')
  t.equal(doc.text(), 'MYR123.45', 'currency MYR123.45')

  doc = wtf('{{currency|123.45|NOK2}}')
  t.equal(doc.text(), 'NOK123.45', 'currency NOK2123.45')

  doc = wtf('{{currency|123.45|RMB}}')
  t.equal(doc.text(), 'CN¥123.45', 'currency RMB123.45')

  doc = wtf('{{USD|950 million}}')
  t.equal(doc.text(), 'US$950 million', 'USD template')

  t.end()
})

test('inrConvert-templates', function (t) {
  let doc = wtf('{{INRConvert|93896}}')
  t.equal(doc.text(), 'inr 93896', 'inrConvert')

  doc = wtf('{{INRConvert|93896|k}}')
  t.equal(doc.text(), 'inr 93896000', 'inrConvert')

  doc = wtf('{{INRConvert|93896|m}}')
  t.equal(doc.text(), 'inr 93896000000', 'inrConvert')

  doc = wtf('{{INRConvert|93896|b}}')
  t.equal(doc.text(), 'inr 93896000000000', 'inrConvert')

  doc = wtf('{{INRConvert|93896|c}}')
  t.equal(doc.text(), 'inr 938960000000', 'inrConvert')

  t.end()
})
