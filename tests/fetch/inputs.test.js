const test = require('tape')
const wtf = require('../lib')

function delay(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve()
    }, time)
  })
}

test('test-formats', async function(t) {
  let arr = [
    'Billy_Steele',
    `? (Enuff Z'nuff album)`,
    `& Juliet`,
    ['Billy Steele'],
    `https://en.m.wikipedia.org/wiki/Freebase`,
    `https://dota2.gamepedia.com/Abaddon`,
    `https://muppet.fandom.com/wiki/Debra_Spinney`
  ]
  for (const a of arr) {
    let doc = await wtf.fetch(a)
    await delay(100)
    t.equal(doc.links().length > 1, true, a + ' links')
  }
  t.end()
})
