import test from 'tape'
import wtf from '../../lib/index.js'

// external-link templates render '[url label]', so the link lands in doc.links()
const check = (t, cases) => {
  cases.forEach(([input, text, href, linkText]) => {
    const doc = wtf(input, { title: 'Page Title' })
    t.equal(doc.text().trim(), text, input + ' text')
    const links = doc.links().map((l) => l.json())
    if (href === null) {
      t.equal(links.length, 0, input + ' has no link')
      return
    }
    t.equal(links.length, 1, input + ' one link')
    t.equal(links[0].type, 'external', input + ' is external')
    t.equal(links[0].site, href, input + ' href')
    t.equal(links[0].text, linkText ?? text, input + ' link text')
  })
}

test('identifier templates', (t) => {
  check(t, [
    ['{{doi|10.1000/xyz123}}', 'doi:10.1000/xyz123', 'https://doi.org/10.1000/xyz123'],
    ['{{ISSN|1234-5678}}', 'ISSN 1234-5678', 'https://www.worldcat.org/issn/1234-5678'],
    ['{{OCLC|1234}}', 'OCLC 1234', 'https://www.worldcat.org/oclc/1234'],
    ['{{PMID|12345}}', 'PMID 12345', 'https://pubmed.ncbi.nlm.nih.gov/12345'],
    ['{{PMC|12345}}', 'PMC 12345', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345'],
    ['{{arXiv|2101.00001}}', 'arXiv:2101.00001', 'https://arxiv.org/abs/2101.00001'],
    ['{{bibcode|2001ApJ...1}}', 'Bibcode:2001ApJ...1', 'https://ui.adsabs.harvard.edu/abs/2001ApJ...1'],
    ['{{JSTOR|1234}}', 'JSTOR 1234', 'https://www.jstor.org/stable/1234'],
    ['{{LCCN|n79021164}}', 'LCCN n79021164', 'https://lccn.loc.gov/n79021164'],
    ['{{hdl|2027/abc}}', 'hdl:2027/abc', 'https://hdl.handle.net/2027/abc'],
    ['{{SSRN|1234}}', 'SSRN 1234', 'https://ssrn.com/abstract=1234'],
    ['{{S2CID|1234}}', 'S2CID 1234', 'https://api.semanticscholar.org/CorpusID:1234'],
    ['{{ASIN|B000}}', 'ASIN B000', 'https://www.amazon.com/dp/B000'],
    ['{{RFC|2616}}', 'RFC 2616', 'https://www.rfc-editor.org/rfc/rfc2616'],
    ['{{IETF RFC|2616}}', 'RFC 2616', 'https://www.rfc-editor.org/rfc/rfc2616'],
    ['{{US patent|1,234,567}}', 'U.S. patent 1,234,567', 'https://patents.google.com/patent/US1234567'],
    ['{{OEIS link|A000045}}', 'A000045', 'https://oeis.org/A000045'],
    ['{{wikidata entity link|Q42}}', 'Q42', 'https://www.wikidata.org/wiki/Q42'],
  ])
  t.end()
})

test('site profile templates', (t) => {
  check(t, [
    ['{{IMDb name|0000008|Marlon Brando}}', 'Marlon Brando at IMDb', 'https://www.imdb.com/name/nm0000008/', 'Marlon Brando'],
    ['{{IMDb title | id= 0426883 | title= Alpha Dog }}', 'Alpha Dog at IMDb', 'https://www.imdb.com/title/tt0426883/', 'Alpha Dog'],
    ['{{IMDb name|0000008}}', 'Page Title at IMDb', 'https://www.imdb.com/name/nm0000008/', 'Page Title'],
    ['{{Rotten Tomatoes|alpha_dog|Alpha Dog}}', 'Alpha Dog at Rotten Tomatoes', 'https://www.rottentomatoes.com/m/alpha_dog', 'Alpha Dog'],
    ['{{Discogs artist|1234|Prince}}', 'Prince at Discogs', 'https://www.discogs.com/artist/1234', 'Prince'],
    ['{{MusicBrainz artist|mbid=31e7b30b|name=Susumu}}', 'Susumu at MusicBrainz', 'https://musicbrainz.org/artist/31e7b30b', 'Susumu'],
    ['{{AllMusic|class=artist|id=mn0000004893|label=Prince}}', 'Prince at AllMusic', 'https://www.allmusic.com/artist/mn0000004893', 'Prince'],
    ['{{Find a Grave|1234|Jane Doe}}', 'Jane Doe at Find a Grave', 'https://www.findagrave.com/memorial/1234', 'Jane Doe'],
    ['{{Baseball-Reference|ruthba01|Babe Ruth}}', 'Babe Ruth at Baseball-Reference.com', 'https://www.baseball-reference.com/players/r/ruthba01.shtml', 'Babe Ruth'],
    ['{{Pro-Football-Reference|BradTo00|Tom Brady}}', 'Tom Brady at Pro-Football-Reference.com', 'https://www.pro-football-reference.com/players/B/BradTo00.htm', 'Tom Brady'],
    ['{{Olympedia|1234|Jane}}', 'Jane at Olympedia', 'https://www.olympedia.org/athletes/1234', 'Jane'],
    ['{{MathWorld|id=Circle|title=Circle}}', 'Circle at MathWorld', 'https://mathworld.wolfram.com/Circle.html', 'Circle'],
    ['{{gutenberg|no=1234|name=Foo}}', 'Foo at Project Gutenberg', 'https://www.gutenberg.org/ebooks/1234', 'Foo'],
    ['{{Goodreads author|1234|Jane}}', 'Jane at Goodreads', 'https://www.goodreads.com/author/show/1234', 'Jane'],
    ['{{playmate|1234|Jane}}', 'Jane', null],
  ])
  t.end()
})

test('social templates', (t) => {
  check(t, [
    ['{{Twitter|AcadiaU|Acadia University}}', 'Acadia University on Twitter', 'https://twitter.com/AcadiaU', 'Acadia University'],
    ['{{Twitter|AcadiaU}}', 'Page Title on Twitter', 'https://twitter.com/AcadiaU', 'Page Title'],
    ['{{Instagram|nasa|NASA}}', 'NASA on Instagram', 'https://www.instagram.com/nasa/', 'NASA'],
    ['{{YouTube|id=9bZkp7q19f0|title=Gangnam Style}}', 'Gangnam Style on YouTube', 'https://www.youtube.com/watch?v=9bZkp7q19f0', 'Gangnam Style'],
    ['{{YouTube|9bZkp7q19f0|Gangnam Style}}', 'Gangnam Style on YouTube', 'https://www.youtube.com/watch?v=9bZkp7q19f0', 'Gangnam Style'],
    ['{{YouTube|user=nasa|NASA}}', 'NASA on YouTube', 'https://www.youtube.com/user/nasa', 'NASA'],
    ['{{YouTube|c=UC123|NASA}}', 'NASA on YouTube', 'https://www.youtube.com/channel/UC123', 'NASA'],
  ])
  t.end()
})

test('link wrapper templates', (t) => {
  check(t, [
    ['{{URL|http://www.example.com/}}', 'www.example.com', 'http://www.example.com/'],
    ['{{URL|example.com}}', 'example.com', 'https://example.com'],
    ['{{URL|http://www.example.com|Example}}', 'Example', 'http://www.example.com'],
    ['{{official website|http://x.com}}', 'Official website', 'http://x.com'],
    ['{{official website|x.com|name=Site}}', 'Site', 'https://x.com'],
    ['{{official website}}', 'Official website', null],
    ['{{plainlink|http://x.com|x}}', 'x', 'http://x.com'],
    ['{{plain link|url=http://x.com|name=x}}', 'x', 'http://x.com'],
    [
      '{{webarchive|url=https://web.archive.org/web/20200101/http://x.com|date=2020-01-01}}',
      'Archived 2020-01-01 at the Wayback Machine',
      'https://web.archive.org/web/20200101/http://x.com',
      'Archived',
    ],
    [
      '{{webarchive|url=https://archive.today/abc|date=2020-01-01|title=My Page}}',
      'My Page Archived 2020-01-01 at archive.today',
      'https://archive.today/abc',
      'Archived',
    ],
    ['{{wayback|url=http://x.com|date=20200101}}', 'Archived 2020-01-01 at the Wayback Machine', 'https://web.archive.org/web/20200101/http://x.com', 'Archived'],
  ])
  t.end()
})

test('sister-project and bible templates', (t) => {
  check(t, [
    ['{{wikt|word}}', 'word', 'https://en.wiktionary.org/wiki/word'],
    ['{{wikt|word|words}}', 'words', 'https://en.wiktionary.org/wiki/word'],
    ['{{wikisource-inline|Foo Bar}}', 'Foo Bar at Wikisource', 'https://en.wikisource.org/wiki/Foo_Bar', 'Foo Bar'],
    ['{{commons category-inline|Foo Bar}}', 'Foo Bar at Wikimedia Commons', 'https://commons.wikimedia.org/wiki/Category:Foo_Bar', 'Foo Bar'],
    ['{{commons category-inline}}', 'Page Title at Wikimedia Commons', 'https://commons.wikimedia.org/wiki/Category:Page_Title', 'Page Title'],
    ['{{bibleverse||John|3:16|KJV}}', 'John 3:16', 'https://www.biblegateway.com/passage/?search=John%203%3A16&version=KJV'],
    ['{{bibleverse|1|Kings|3:16}}', '1 Kings 3:16', 'https://www.biblegateway.com/passage/?search=1%20Kings%203%3A16'],
    ['{{bibleref|John|3:16}}', 'John 3:16', 'https://www.biblegateway.com/passage/?search=John%203%3A16'],
  ])
  t.end()
})

test('external-link templates keep their data and work in lists and infoboxes', (t) => {
  const doc = wtf('== External links ==\n* {{IMDb name|0000008|Marlon Brando}}\n* {{Twitter|brando}}', { title: 'Marlon Brando' })
  const items = doc.lists()[0].json().items
  t.equal(items[0].text, 'Marlon Brando at IMDb', 'list item text')
  t.equal(items[0].links[0].site, 'https://www.imdb.com/name/nm0000008/', 'list item link')
  t.equal(items[1].text, 'Marlon Brando on Twitter', 'page title fallback')
  const tmpl = doc.templates()[0].json()
  t.equal(tmpl.data.id, '0000008', 'id kept as data')
  t.equal(tmpl.data.title, 'Marlon Brando', 'title kept as data')
  t.equal(tmpl.kind, 'imdb name', 'kind')

  const box = wtf('{{Infobox company|name=Acme|website={{URL|https://acme.com}}}}').infobox()
  t.equal(box.get('website').text(), 'acme.com', 'infobox url text')
  t.equal(box.get('website').links()[0].json().site, 'https://acme.com', 'infobox url link')
  t.end()
})
