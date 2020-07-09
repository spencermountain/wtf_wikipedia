const test = require('tape')
const wtf = require('../lib')

test('3rd-party image bulbapedia', function (t) {
  t.plan(3)
  var p = wtf.fetch('https://bulbapedia.bulbagarden.net/wiki/Aegislash_(Pok%C3%A9mon)', { path: 'w/api.php' })

  p.then((doc) => {
    t.equal(doc.domain(), 'bulbapedia.bulbagarden.net', 'got domain from url input')

    let urls = doc.images().map((j) => j.url())
    t.ok(urls.length > 2, 'got urls')
    t.ok(urls[0].match(/bulbapedia\.bulbagarden\.net/), '3rd-party image url')
  })
  p.catch(function (e) {
    t.throw(e)
  })
})

test('3rd-party image mozilla', function (t) {
  t.plan(3)
  var p = wtf.fetch('WeeklyUpdates/020-06-29', { domain: 'wiki.mozilla.org' })
  p.then((doc) => {
    t.equal(doc.domain(), 'wiki.mozilla.org', 'got domain from obj input')

    let urls = doc.images().map((j) => j.url())
    t.ok(urls.length === 1, 'got url')
    t.equal(
      urls[0],
      'https://wiki.mozilla.org/wiki/Special:Redirect/file/Don%E2%80%99t_hurt_the_Web.png',
      'got working image'
    )
  })
  p.catch(function (e) {
    t.throw(e)
  })
})
