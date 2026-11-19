import test from 'tape'
import wtf from './_lib.js'

test('birth and death dates from the first sentence', (t) => {
  const arr = [
    ["'''Foo''' (born June 1, 1950) is.", { year: 1950, month: 5, date: 1 }, null],
    ["'''Foo''' (/fu/; born June 1, 1950) is.", { year: 1950, month: 5, date: 1 }, null],
    ["'''Foo''' (born c. 1950) is.", { year: 1950 }, null],
    ["'''Foo''' (née Bar; born 1950) is.", { year: 1950 }, null],
    ["'''Foo''' (1 June 1950 – 2 July 2000) is.", { year: 1950, month: 5, date: 1 }, { year: 2000, month: 6, date: 2 }],
  ]
  arr.forEach(([str, birth, death]) => {
    const doc = wtf(str)
    t.deepEqual(doc.birthDate(), birth, `birth: ${str}`)
    t.deepEqual(doc.deathDate(), death, `death: ${str}`)
  })
  t.end()
})

test('long text takes linear time', (t) => {
  const arr = [
    ['nationality', `x was an ${'Aaa '.repeat(300000)}b.`, (doc) => doc.nationality()],
    ['birthDate', `{{Infobox person|birth_date=${'1/1 '.repeat(100000)}}}`, (doc) => doc.birthDate()],
  ]
  arr.forEach(([label, str, run]) => {
    const doc = wtf(str)
    const begin = Date.now()
    run(doc)
    const ms = Date.now() - begin
    t.ok(ms < 1000, `${label} took ${ms}ms`)
  })
  t.equal(wtf('Foo was an American French painter.').nationality(), 'American French', 'the demonym')
  t.end()
})
