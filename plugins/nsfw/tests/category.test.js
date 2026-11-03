import test from 'tape'
import wtf from './_lib.js'

const cat = (name) => wtf(`Some text.\n[[Category:${name}]]`).nsfw()

test('category detection', function (t) {
  t.equal(cat('Brothels')[0].type, 'sexuality', 'pattern match')
  t.equal(cat('Inhalants')[0].type, 'drug-use', 'exact mapping')
  t.equal(cat('English profanity')[0].type, 'profanity', 'exact mapping')
  t.equal(cat('Bolt-action rifles')[0].type, 'weapons', 'rifles pattern')
  t.equal(cat('Hand grenades')[0].type, 'weapons', 'grenades pattern')
  t.equal(cat('Nazi propaganda films')[0].type, 'profanity', 'propaganda films pattern')
  t.equal(cat('Strip_Clubs')[0].type, 'sexuality', 'case and underscores normalised')

  const res = cat('Brothels')
  t.deepEqual(res[0].evidence, [{ source: 'category', name: 'brothels' }], 'evidence shape')
  t.end()
})

test('category allow-list', function (t) {
  // these would match a pattern, but are listed in okay.js
  t.deepEqual(cat('Breast cancer survivors'), [], 'okay-list beats /breast/')
  t.deepEqual(cat('Deaths from breast cancer'), [], 'okay-list beats /breast/')
  t.deepEqual(cat('Explosives engineers'), [], 'okay-list beats /explosives/')
  t.deepEqual(cat('Songs about nuclear war and weapons'), [], 'okay-list beats / weapons$/')
  t.deepEqual(cat('Canadian film directors'), [], 'unrelated category')
  t.end()
})
