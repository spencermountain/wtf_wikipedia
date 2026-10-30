import test from 'tape'
import wtf from './_lib.js'

const raptors = `{{short description|Canadian professional basketball team}}
The '''Toronto Raptors''' are a Canadian professional [[basketball]] team based in [[Toronto]]. They compete in the [[National Basketball Association]].
[[Category:Toronto Raptors]]
[[Category:Basketball teams in Ontario]]`

const noTemplate = `The '''Toronto Raptors''' are a Canadian professional [[basketball]] team based in [[Toronto]]. They compete in the [[National Basketball Association]].
[[Category:Basketball teams in Ontario]]`

test('summary sources and options', (t) => {
  t.equal(wtf(raptors).summary(), 'Canadian professional basketball team', 'short description wins')
  t.equal(wtf(`{{Short description|Species of bird}} x`).summary(), 'Species of bird', 'capitalized template name')
  t.equal(
    wtf(raptors).summary({ template: false }),
    'a Canadian professional basketball team based in Toronto',
    'template:false → first sentence'
  )
  t.equal(
    wtf(noTemplate).summary({ article: false }),
    'Canadian professional basketball team based in Toronto',
    'article:false drops leading article'
  )
  t.equal(wtf(noTemplate).summary({ sentence: false }), 'A basketball team in Ontario', 'sentence:false → category')
  t.equal(
    wtf(`{{short description|none}} hi`).summary({ sentence: false, category: false }),
    '',
    'nothing usable → empty'
  )
  t.equal(wtf('').summary(), '', 'empty doc')
  t.end()
})

test('summary from first sentence', (t) => {
  const cases = [
    [
      `'''Ada Lovelace''' (10 December 1815 – 27 November 1852) was an English mathematician.`,
      'an English mathematician',
    ],
    [`'''Paris''' is the capital and largest city of [[France]].`, 'the capital and largest city of France'],
    [`'''Mount Everest''' is Earth's highest mountain above sea level.`, "Earth's highest mountain above sea level"],
    [
      `The '''Beatles''' were an English [[rock music|rock]] band formed in [[Liverpool]] in 1960.`,
      'an English rock band formed in Liverpool in 1960',
    ],
  ]
  cases.forEach(([str, want]) => {
    t.equal(wtf(str).summary({ category: false }), want, want)
  })
  t.end()
})

test('summary length limits', (t) => {
  const long = `'''Foo''' is a very long and winding description of something that goes on and on, with many clauses, and many more words than anyone would ever want in a summary of anything at all.`
  const res = wtf(long).summary({ category: false })
  t.ok(res.length < 80, 'default max respected')
  t.ok(wtf(long).summary({ category: false, max: 30 }).length < 30, 'custom max respected')
  t.end()
})

test('summary from category', (t) => {
  t.equal(
    wtf(`x [[Category:Canadian jazz pianists]]`).summary(),
    'A Canadian jazz pianist',
    'plural → singular with article'
  )
  t.equal(
    wtf(`x [[Category:1990 births]] [[Category:Living people]]`).summary(),
    '',
    'only year/meta categories → empty'
  )
  t.end()
})

test('tense', (t) => {
  t.equal(wtf(`The '''Toronto Raptors''' are a basketball team.`).tense(), 'Present', 'are')
  t.equal(wtf(`'''Ada Lovelace''' was an English mathematician.`).tense(), 'Past', 'was')
  t.equal(wtf(`The '''Hanseatic League''' dominated Baltic trade.`).tense(), 'Past', 'past-tense verb')
  t.equal(wtf(`'''CoolToday Park''' will be a ballpark.`).tense(), 'Future', 'will be')
  t.equal(wtf(`The '''Line 6''' is an upcoming light rail line.`).tense(), 'Future', 'an upcoming')
  t.equal(wtf('').tense(), 'Present', 'empty doc → Present')
  t.end()
})

test('article', (t) => {
  t.equal(wtf(raptors).article(), 'they', 'they (2nd sentence)')
  t.equal(wtf(`'''Jane''' is a writer. She lives in Paris.`).article(), 'she', 'she')
  t.equal(wtf(`'''Jim''' is a writer. His books sell well.`).article(), 'his', 'possessive pronoun found')
  t.equal(wtf('').article(), 'it', 'empty doc → it')
  t.end()
})

test('tense: future passive', { todo: true }, (t) => {
  // "will be held" is tagged #PastTense (held) and the past check runs before the future check
  t.equal(wtf(`The '''2032 Olympics''' will be held in Brisbane.`).tense(), 'Future', 'will be held')
  t.end()
})
