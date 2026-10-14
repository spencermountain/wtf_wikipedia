import test from 'tape'
import wtf from '../lib/index.js'

// Recovered from commented reference assertions; inspect links through their methods.
test('inline references retain external links', (t) => {
  const cases = [
    ['<ref name="quote">[http://www.imdb.com/name/nm3225194/ Allen Morris IMDb profile]</ref>',
      'http://www.imdb.com/name/nm3225194/'],
    ['<ref name="ChapmanRoutledge">Siobhan Chapman, {{ISBN|0-19-518767-9}}, [https://books.google.com/books?id=Vfr Google Print, p. 166]</ref>',
      'https://books.google.com/books?id=Vfr'],
  ]
  cases.forEach(([input, url]) => {
    const links = wtf(input).reference().links().map((link) => link.site())
    t.ok(links.includes(url), 'reference retains ' + url)
  })
  t.end()
})

test('image JSON retains links in captions', (t) => {
  const image = wtf("[[File:Wikipedesketch1.png|thumb|The Wikipede edits ''[[Myriapoda]]''.]]").image().json()
  t.equal(image.links?.[0]?.page, 'Myriapoda', 'caption link in serialized image')
  t.end()
})
