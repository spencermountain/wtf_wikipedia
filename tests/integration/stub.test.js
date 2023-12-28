import test from 'tape'
import wtf from '../lib/index.js'

test('isStub', function (t) {
  let arr = [
    `{{stub}}`,
    `{{Gauteng saadjie}}`,
    `{{Wes-Kaap saadjie}} `,
    `{{Suid-Afrika-saadjie}} `,
    `{{토막글}}`,
    `{{토막글|??}}`,
    `{{Canada-theat-struct-stub}}`,
    `{{Ontario-struct-stub}}`,
    `{{Esbozo}}`,
    // ``,
  ]
  arr.forEach((str) => {
    let doc = wtf('foo bar ' + str + ' and so on')
    t.equal(doc.isStub(), true, str)
  })
  t.end()
})

test('not stub', function (t) {
  let arr = [`{{not-stub-man}}`, `{{토막}}`, `{{??}}`, `{{s}}`, ``]
  arr.forEach((str) => {
    let doc = wtf('foo bar ' + str + ' and so on')
    t.equal(doc.isStub(), false, str)
  })
  t.end()
})
