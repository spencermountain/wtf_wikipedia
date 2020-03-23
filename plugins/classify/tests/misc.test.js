const test = require('tape')
const wtf = require('./_lib')

test('misc', async function(t) {
  t.ok(true)

  // var arr = [
  // '2008-British-motorcycle-Grand-Prix'//Event
  // 'Allen-R.-Morris'//Person
  // 'al_Haytham'
  // 'Alsea-(company)',
  // 'Altimont-Butler',
  // 'Antique-(band)',
  // 'Anwar_Kamal_Khan',
  // 'Arts_Club_of_Chicago',
  // 'BBDO',
  // 'Bazooka',
  // 'Bodmin',
  // 'Bradley-(community),-Lincoln-County,-Wisconsin',
  // 'Britt-Morgan',
  // 'Canton-of-Etaples',
  // 'Charlie-Milstead',
  // 'Chemical-biology',
  // 'Clint-Murchison-Sr.',
  // 'Damphu-drum'
  // ]
  // arr.forEach(file => {
  //   let txt = require('fs')
  //     .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
  //     .toString()
  //   let doc = wtf(txt)
  //   let res = doc.classify()
  //   console.log(res)
  // })

  t.end()
})
