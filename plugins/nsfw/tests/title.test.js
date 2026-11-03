import test from 'tape'
import wtf from './_lib.js'

// wtf_wikipedia takes the page title as an option
const titled = (title) => wtf('Hello there.', { title })

test('title detection', function (t) {
  t.equal(titled('Foo (pimp)').nsfw()[0].type, 'sexuality', 'mapped parenthetical')
  t.equal(titled('Foo (sex position)').nsfw()[0].type, 'sexuality', 'mapped multi-word parenthetical')
  t.equal(titled('Foo (Sexual_Slang)').nsfw()[0].type, 'sexuality', 'case and underscores normalised')
  t.equal(titled('Foo (sexual practice)').nsfw()[0].type, 'sexuality', 'regex fallback')

  const res = titled('Foo (pimp)').nsfw()
  t.deepEqual(res[0].evidence, [{ source: 'title', name: 'pimp' }], 'evidence shape')
  t.end()
})

test('title false-positives', function (t) {
  const safe = [
    'Colchester (Essex)',
    'Middlesex (county)',
    'Alsea (company)',
    'Tornado (film)',
    'Sex Pistols',
    'Wessex'
  ]
  safe.forEach((title) => {
    t.deepEqual(titled(title).nsfw(), [], title)
  })
  t.end()
})
