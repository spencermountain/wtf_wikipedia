'use strict'
var test = require('tape')
var wtf = require('./lib')

test('custom templates', t => {
  var str = `hello {{mytmpl|fun times}} world`
  var obj = wtf(str).custom
  t.equal(obj, undefined, 'no-custom responses at first')

  wtf.custom({
    mytmpl: tmpl => {
      var m = tmpl.match(/^\{\{mytmpl\|(.+)\}\}$/) || {}
      return m[1]
    }
  })
  obj = wtf(str).custom
  t.equal(obj.mytmpl[0], 'fun times', 'has custom responses now')

  t.end()
})
