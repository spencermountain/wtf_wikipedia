'use strict';
var test = require('tape');
const wtf = require('../src/index');

test('custom templates', t => {
  let str = `hello {{mytmpl|fun times}} world`;
  let obj = wtf.parse(str).custom;
  t.equal(obj, undefined, 'no-custom responses at first');

  wtf.custom({
    mytmpl: (tmpl) => {
      let m = tmpl.match(/^\{\{mytmpl\|(.+)\}\}$/) || {};
      // wiki = wiki.replace(tmpl, m[1]);
      return m[1];
    }
  });
  obj = wtf.parse(str).custom;
  t.equal(obj.mytmpl, 'fun times', 'has custom responses now');

  t.end();
});
