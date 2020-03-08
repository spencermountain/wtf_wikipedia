var test = require('tape')
var wtf = require('../lib')

test('fetch-as-promise', t => {
  let arr = [
    `? (Enuff Z'nuff album)`,
    `& Juliet`,
    ['Toronto', 'Montreal'],
    `https://en.m.wikipedia.org/wiki/Freebase`,
    `https://dota2.gamepedia.com/Abaddon`,
    `https://muppet.fandom.com/wiki/Debra_Spinney`
  ]
  arr.forEach(async a => {
    console.log(a)
    let doc = await wtf.fetch(a)
  })
  t.end()
})
