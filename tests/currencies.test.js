var test = require('tape');
var wtf = require('./lib');

test('currency-templates', function(t) {
  let doc = wtf('hello {{GBP|123.45}} world.');
  t.equal(doc.text(), 'hello GB£123.45 world.', 'gbp');

  doc = wtf('and now {{US$|21.20&nbsp;billion}}');
  t.equal(doc.text(), 'and now US$21.20 billion', 'usd');

  doc = wtf('{{Currency|1,000|JPY}} world');
  t.equal(doc.text(), '¥1,000 world', 'yen');

  t.equal(doc.templates().length, 1, 'got a template');
  t.equal(doc.templates(0).amount, '1,000', 'got template amount');

  doc = wtf('hello {{ZAR}} world');
  t.equal(doc.text(), 'hello R world', 'empty currency');

  doc = wtf('{{Unité|107.70|M€}}');
  t.equal(doc.text(), '107.70 M€', 'french unit 2 parameters');

  doc = wtf('{{Unité|107.70}}');
  t.equal(doc.text(), '107.70', 'french unit 1 parameter');

  doc = wtf('{{monnaie|107.70|€}}');
  t.equal(doc.text(), '€107.70', 'french monnaie 2 parameters');

  doc = wtf('{{nombre|107.70 M€}}');
  t.equal(doc.text(), '107.70 M€', 'french nombre 1 parameter');

  doc = wtf('{{nombre|107.70|M€}}');
  t.equal(doc.text(), '107.70 M€', 'french nombre 2 parameters M€');

  doc = wtf('{{nombre|107.70|€}}');
  t.equal(doc.text(), '€107.70', 'french nombre 2 parameters €');

  doc = wtf('{{nombre|107.70|euro}}');
  t.equal(doc.text(), '€107.70', 'french nombre 2 parameters euro');

  doc = wtf('{{nb|107.70|€}}');
  t.equal(doc.text(), '€107.70', 'french nombre 2 parameters');

  t.end();
});
