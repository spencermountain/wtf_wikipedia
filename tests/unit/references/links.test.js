import test from 'tape'
import wtf from '../../lib/index.js'

// Recovered from commented reference assertions; inspect links through their methods.
test('inline references retain external links', (t) => {
  const cases = [
    [
      '<ref name="quote">[http://www.imdb.com/name/nm3225194/ Allen Morris IMDb profile]</ref>',
      'http://www.imdb.com/name/nm3225194/',
    ],
    [
      '<ref name="ChapmanRoutledge">Siobhan Chapman, {{ISBN|0-19-518767-9}}, [https://books.google.com/books?id=Vfr Google Print, p. 166]</ref>',
      'https://books.google.com/books?id=Vfr',
    ],
  ]
  cases.forEach(([input, url]) => {
    const links = wtf(input)
      .reference()
      .links()
      .map((link) => link.site())
    t.ok(links.includes(url), 'reference retains ' + url)
  })
  t.end()
})

test('references without inline links return an empty array', (t) => {
  t.deepEqual(wtf('<ref>Plain reference</ref>').reference().links().length, 0, 'plain reference returns no links')
  t.deepEqual(
    wtf('<ref>{{cite web|title=Source|url=https://example.com}}</ref>').reference().links().length,
    0,
    'cite web reference returns no links'
  )
  t.end()
})
