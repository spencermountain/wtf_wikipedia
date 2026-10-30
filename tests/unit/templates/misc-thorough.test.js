import test from 'tape'
import wtf from '../../lib/index.js'

const first = (str) => wtf(str).templates()[0]?.json() || {}
const pages = (str) =>
  wtf(str)
    .links()
    .map((l) => l.page())

test('symbol templates', (t) => {
  const arr = [
    ['{{mdash}}', '—'],
    ['a{{ndash}}b', 'a–b'],
    ['{{en dash}}', '–'],
    ['{{em dash}}', '—'],
    ['{{dagger}}', '†'],
    ['{{double-dagger}}', '‡'],
    ['{{=}}', '='],
    ['{{pi}}', 'π'],
    ['{{middot}}', '·'],
    ['{{dot}}', '·'],
    ['{{1/2}}', '1⁄2'],
    ['{{3/4}}', '3⁄4'],
    ['{{plusminus}}', '±'],
    ['{{ampersand}}', '&'],
    ['{{xmark}}', '❌'],
    ['{{goldmedal}}', '🥇'],
    ['{{silvermedal}}', '🥈'],
    ['{{bronzemedal}}', '🥉'],
    ['a{{spaced ndash}}b', 'a – b'],
    ['a{{snd}}b', 'a – b'],
    ['a{{!}}b', 'a|b'],
    ['a{{colon}}b', 'a:b'],
  ]
  arr.forEach(([str, text]) => t.equal(wtf(str).text(), text, str))
  t.end()
})

test('flag templates', (t) => {
  const arr = [
    ['{{flagicon|BRA}}', '🇧🇷', ['Brazil']],
    ['{{flagdeco|CAN}}', '🇨🇦', []],
    ['{{flag|Brazil}}', '🇧🇷 Brazil', ['Brazil']],
    ['{{can}}', '🇨🇦', []],
    ['{{usa}}', '🇺🇸', []],
    ['{{flagathlete|[[Michael Phelps]]|USA}}', '🇺🇸 Michael Phelps (USA)', ['Michael Phelps']],
    ['{{flagathlete|Usain Bolt|JAM}}', '🇯🇲 Usain Bolt (JAM)', ['Usain Bolt']],
  ]
  arr.forEach(([str, text, links]) => {
    t.equal(wtf(str).text(), text, `${str} text`)
    t.deepEqual(pages(str), links, `${str} links`)
  })
  t.equal(wtf('{{flagicon|XYZ}}').text(), '', 'unknown flagicon renders nothing')
  t.equal(pages('{{flagcountry|CAN}}')[0], 'Canada', 'flagcountry links the country')
  t.equal(pages('{{fb|ENG}}')[0], 'England national football team', 'fb links the national team')
  t.end()
})

test('fraction and math notation', (t) => {
  const arr = [
    ['{{frac|1|2}}', '1/2'],
    ['{{frac|1|1|2}}', '1 1/2'],
    ['{{sfrac|3|8}}', '3⁄8'],
    ['{{radic|2}}', '√2'],
    ['{{radic|2|3}}', '3√2'],
    ['{{ceil|x}}', '⌈x⌉'],
    ['{{floor|2.5}}', '⌊2.5⌋'],
    ['{{bra-ket|φ|ψ}}', '⟨φ|ψ⟩'],
    ['{{braket|bra|φ}}', '⟨φ|'],
    ['{{angle bracket|x}}', '⟨x⟩'],
    ['{{pars|x}}', '(x)'],
    ['{{gaps|1|234|567}}', '1 234 567'],
  ]
  arr.forEach(([str, text]) => t.equal(wtf(str).text(), text, str))
  const integral = wtf('{{intmath|int|a|b}}').text()
  t.ok(integral.includes('∫') && integral.includes('a') && integral.includes('b'), 'intmath shows ∫ with both limits')
  t.match(wtf('{{intmath|oint}}').text(), /∮/, 'contour integral sign')
  t.match(wtf('{{DEC|-5|23|28}}').text(), /5°\s*23′\s*28″/, 'declination degrees, minutes, seconds')
  t.end()
})

test('station and transit link templates', (t) => {
  const arr = [
    ['{{lrt station|Bukit Panjang}}', 'Bukit Panjang', 'Bukit Panjang LRT station'],
    ['{{mrt station|Orchard}}', 'Orchard', 'Orchard MRT station'],
    ['{{ferry|Manly}}', 'Manly', 'Manly ferry wharf'],
    ['{{tram|Box Hill}}', 'Box Hill', 'Box Hill tram stop'],
    ['{{rht|Abbey}}', 'Abbey', 'Abbey railway halt'],
    ['{{bssrws|Dhaka}}', 'Dhaka', 'Dhaka railway station'],
    ['{{subway|Union}}', 'Union', 'Union subway station'],
    ['{{lbb|Arun}}', 'Arun', 'Arun-class lifeboat'],
    ['{{mlb year|1990}}', '1990', '1990 Major League Baseball season'],
    ['{{nlds year|1995}}', '1995', '1995 National League Division Series'],
    ['{{alds year|2001}}', '2001', '2001 American League Division Series'],
  ]
  arr.forEach(([str, text, page]) => {
    t.equal(wtf(str).text(), text, `${str} text`)
    t.equal(pages(str)[0], page, `${str} link`)
  })
  t.end()
})

test('text utility templates', (t) => {
  const arr = [
    ['{{bracket|sic}}', '[sic]'],
    ['{{in title|foo}}', 'All pages with titles containing foo'],
    ['{{look from|foo}}', 'All pages with titles beginning with foo'],
    ['{{literal translation|man of the house}}', "lit. 'man of the house'"],
    ['{{lit|a|b}}', "lit. 'a' or 'b'"],
    ['{{ifnotempty|x|yes|no}}', 'yes'],
    ['{{ifnotempty||yes|no}}', 'no'],
    ['{{transliteration|ru|Moskva}}', 'Moskva'],
    ['{{transliteration|ru|ALA|Moskva}}', 'Moskva'],
    ['{{splitspan|a|b}}', 'a b'],
    ['{{own}}', 'Own work'],
    ['{{padleft:7|3|0}}', '007'],
  ]
  arr.forEach(([str, text]) => t.equal(wtf(str).text(), text, str))
  t.end()
})

test('text-and-data templates', (t) => {
  const vg = '{{video game release|NA|March 5, 2010|EU|March 12, 2010}}'
  t.equal(wtf(vg).text(), 'NA: March 5, 2010\n\nEU: March 12, 2010', 'video game release text')
  t.deepEqual(
    first(vg).data.releases,
    [
      { region: 'NA', date: 'March 5, 2010' },
      { region: 'EU', date: 'March 12, 2010' },
    ],
    'video game release data'
  )
  t.equal(wtf('{{tweet|text=hello world|date=2020}}').text(), 'hello world 2020', 'tweet text and date')
  t.equal(first('{{tweet|text=hello world|date=2020}}').data.text, 'hello world', 'tweet data')
  const poem = wtf('{{poem quote|text=Roses are red|char=Bob|title=Poems}}').text()
  t.ok(poem.startsWith('Roses are red'), 'poem quote text')
  t.match(poem, /— Bob Poems/, 'poem quote attribution')
  t.equal(first('{{poem quote|Roses are red}}').data.text, 'Roses are red', 'poem quote positional text')
  t.end()
})

test('data-only templates', (t) => {
  const spoken = first('{{spoken wikipedia|Foo.ogg|2010-01-01}}')
  t.equal(spoken.data.file, 'Foo.ogg', 'spoken wikipedia file')
  t.equal(spoken.data.date, '2010-01-01', 'spoken wikipedia date')
  t.equal(spoken.kind, 'audio', 'spoken wikipedia is an audio template')
  t.equal(wtf('{{spoken wikipedia|Foo.ogg|2010-01-01}}').text(), '', 'spoken wikipedia renders no text')
  const graph = first('{{graph|x=1,2,3|y=4, 5 ,6}}')
  t.deepEqual(graph.data.x, ['1', '2', '3'], 'graph x values split')
  t.deepEqual(graph.data.y, ['4', '5', '6'], 'graph y values trimmed')
  const multi = first('{{graph|x=1,2|y1=3,4|y2=5, 6}}')
  t.deepEqual(multi.data.y1, ['3', '4'], 'graph y1 series split')
  t.deepEqual(multi.data.y2, ['5', '6'], 'graph y2 series split')
  t.equal(wtf('{{graph|x=1,2|y=3,4}}').text(), '', 'graph renders no text')
  t.end()
})

test('symbol templates: fixed', (t) => {
  t.equal(wtf('a{{nbsp}}b').text(), 'a b', 'nbsp becomes a space')
  t.equal(wtf('{{pipe}}').text(), '|', 'pipe')
  t.equal(wtf('{{number sign}}').text(), '#', 'number sign')
  t.equal(wtf('{{asterisk}}').text(), '*', 'asterisk')
  t.end()
})

test('flag templates: fixed', (t) => {
  t.equal(wtf('{{flagcu|USA}}').text(), '🇺🇸 United States', 'flagcu country name is capitalised')
  t.equal(wtf('{{flagcountry|CAN}}').text(), '🇨🇦 Canada', 'flagcountry country name is capitalised')
  t.equal(wtf('{{fb|ENG}}').text(), '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', 'fb team name is capitalised')
  t.end()
})

test('math and text templates: fixed', (t) => {
  t.equal(wtf('{{frac|4}}').text(), '1/4', 'single-argument frac is 1/x')
  t.equal(wtf('{{bra|φ}}').text(), '⟨φ|', 'bra is not the Brazil flag')
  t.equal(wtf('{{ket|ψ}}').text(), '|ψ⟩', 'ket has a leading bar')
  t.equal(wtf('{{braket|ket|ψ}}').text(), '|ψ⟩', 'braket ket form')
  t.equal(wtf('{{padleft:7|3|x}}').text(), 'xx7', 'padleft uses the padding string')
  t.equal(wtf('{{padright:abc|5|-}}').text(), 'abc--', 'padright uses the padding string')
  t.match(wtf('{{RA|5|35|17.3}}').text(), /5h\s*35m\s*17\.3s/, 'right ascension in h m s')
  t.end()
})

test('data templates: fixed', (t) => {
  t.match(wtf('{{ReptileDatabase|genus=Naja|species=naja}}').text(), /Naja naja/, 'ReptileDatabase renders the taxon')
  t.match(wtf('{{GEOnet3|-123|Foo}}').text(), /GEOnet Names Server/, 'GEOnet3 renders a source line')
  const ref = wtf('Foo<ref>{{cite gnis|1234|Foo Creek}}</ref>').references()[0]?.json().data || {}
  t.equal(ref.id, '1234', 'cite gnis id')
  t.equal(ref.name, 'Foo Creek', 'cite gnis name')
  t.end()
})
