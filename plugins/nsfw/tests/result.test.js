import test from 'tape'
import wtf from './_lib.js'

const TYPES = ['sexuality', 'drug-use', 'weapons', 'violence', 'profanity', 'obscenity']

test('safe result is an empty array', function (t) {
  const res = wtf('Hello there.\n[[Category:Canadian film directors]]').nsfw()
  t.deepEqual(res, [], 'no warnings')
  t.end()
})

test('unsafe result shape', function (t) {
  const res = wtf('{{Terrorism}}\n[[Category:Inhalants]]').nsfw()
  t.deepEqual(res.map((w) => w.type).sort(), ['drug-use', 'violence'], 'one warning per type')
  res.forEach((w) => {
    t.ok(TYPES.includes(w.type), `'${w.type}' is a known type`)
    t.equal(w.evidence.length, 1, `'${w.type}' has one piece of evidence`)
  })
  t.end()
})

test('evidence merges across sources', function (t) {
  const res = wtf('{{Human sexuality}}\n[[Category:Casual sex]]').nsfw()
  t.equal(res.length, 1, 'one warning')
  t.equal(res[0].type, 'sexuality', 'both hits are sexuality')
  t.deepEqual(res[0].evidence.map((e) => e.source).sort(), ['category', 'template'], 'evidence from both sources')
  t.end()
})

test('warnings sorted by evidence count', function (t) {
  const res = wtf('{{Human sexuality}}\n{{Terrorism}}\n[[Category:Casual sex]]').nsfw()
  t.equal(res.length, 2, 'two warnings')
  t.equal(res[0].type, 'sexuality', 'most evidence first')
  t.equal(res[0].evidence.length, 2, 'two sexuality hits')
  t.equal(res[1].type, 'violence', 'single hit last')
  t.end()
})
