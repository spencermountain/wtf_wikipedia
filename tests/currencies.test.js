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
  t.end();
});
