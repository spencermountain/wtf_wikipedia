import test from 'tape'
import wtf from '../lib/index.js'

function delay(time) {
  return new Promise(function (resolve) {  
    setTimeout(function () {
      resolve()
    }, time)
  })
}

test('test-array', async function (t) {
  const arr = [
    ['Toronto', 'Montreal'],
    ['R', 'π'],
  ]
  for (const a of arr) {
    const docs = await wtf.fetch(a).catch(Error)
    await delay(100)
    t.equal(docs.length, a.length, 'all-docs ')
  }
  t.end()
})
