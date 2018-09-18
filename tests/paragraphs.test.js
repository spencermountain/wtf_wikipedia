'use strict';
var test = require('tape');
var wtf = require('./lib');

test('references', t => {
  var str = `John smith was a comedian<ref name="cool">{{cite web |url=http://supercool.com |title=John Smith sure was |last= |first= |date= |website= |publisher= |access-date= |quote=}}</ref>
and tap-dance pioneer. He was born in glasgow<ref>irelandtimes</ref>.

This is paragraph two.<ref>{{cite web |url=http://paragraphtwo.net}}</ref> It is the same deal.

==Section==
Here is the third paragraph. Nobody knows if this will work.<ref>[http://commonsense.com/everybody|says everybody]</ref>

`;
  var doc = wtf(str);
  t.equal(doc.sections().length, 2, 'sections');
  t.equal(doc.paragraphs().length, 3, 'paragraphs');
  t.equal(doc.references().length, 4, 'all references');
  t.equal(doc.sections(0).references().length, 3, 'first references');
  t.end();
});


test('newlines in templates', t => {
  var str = `hello world{{cite web |url=http://coolc.om |title=whoa hello |last= |first=



|date= |website= |publisher= |access-date=


|quote=}}

Paragraph two!`;
  var doc = wtf(str);
  t.equal(doc.paragraphs().length, 2, 'paragraphs');
  t.equal(doc.paragraphs(0).text, 'hello world', 'first paragraph');
  t.equal(doc.paragraphs(1).text, 'Paragraph two!', '2nd paragraph');
  t.end();
});
