const test = require('tape')
const wtf = require('../lib')

function delay(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve()
    }, time)
  })
}

test('test-array', async function(t) {
  let arr = [
    ['Toronto', 'Montreal'],
    ['R', 'π']
  ]
  for (const a of arr) {
    let docs = await wtf.fetch(a)
    await delay(100)
    t.equal(docs.length, a.length, 'all-docs ')
  }
  t.end()
})
