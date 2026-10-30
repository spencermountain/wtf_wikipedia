import test from 'tape'
import wtf from '../../lib/index.js'

// text output of inline templates, checked against what en.wikipedia renders
const check = (t, cases) => {
  cases.forEach(([input, want]) => {
    t.equal(wtf(input).text(), want, input)
  })
}

test('reign and circa', (t) => {
  check(t, [
    ['{{reign|1901|1910}}', 'r. 1901–1910'],
    ['{{reign|27 BCE|14 CE}}', 'r. 27 BCE – 14 CE'],
    ['{{reign|1901}}', 'r. 1901–'],
    ['{{r.|1901|1910}}', 'r. 1901–1910'],
    ['{{circa|1901}}', 'c. 1901'],
    ['{{c.|1901}}', 'c. 1901'],
    ['{{circa|1901|1910}}', 'c. 1901 – c. 1910'],
    ['born {{circa|1956}} in Toronto', 'born c. 1956 in Toronto'],
  ])
  t.end()
})

test('key press', (t) => {
  check(t, [
    ['Press {{key press|Ctrl|C}} to copy', 'Press Ctrl+C to copy'],
    ['{{key press|Ctrl|Alt|Del}}', 'Ctrl+Alt+Del'],
    ['{{key press|Enter}}', 'Enter'],
    ['{{key press|Ctrl|C|chain=-}}', 'Ctrl-C'],
  ])
  t.end()
})

test('rnd rounds', (t) => {
  check(t, [
    ['{{rnd|3.14159|2}}', '3.14'],
    ['{{rnd|1234|-2}}', '1200'],
    ['{{rnd|2.5|0}}', '3'],
    ['{{rnd|5}}', '5'],
  ])
  t.end()
})

test('replace vs str rep', (t) => {
  check(t, [
    ['{{replace|hello|l|r}}', 'herro'],
    ['{{replace|foo_bar_baz|_|-}}', 'foo-bar-baz'],
    ['{{str rep|hello|l|r}}', 'herlo'],
    ['{{str rep|foo_bar_baz|_|-}}', 'foo-bar_baz'],
  ])
  t.end()
})

test('delink strips link markup', (t) => {
  check(t, [
    ['{{delink|[[Foo]] [[Bar|baz]]}}', 'Foo baz'],
    ["{{delink|'''bold''' [[Foo]]}}", 'bold Foo'],
    ['{{delink|[[Target|Label]]}}', 'Label'],
  ])
  t.end()
})

test('plural parser-function vs template', (t) => {
  check(t, [
    ['{{plural:2|is|are}}', 'are'],
    ['{{PLURAL:1|is|are}}', 'is'],
    ['{{PLURAL:0|box|boxes}}', 'boxes'],
    ['{{plural|2|page}}', '2 pages'],
    ['{{plural|1|page}}', '1 page'],
  ])
  t.end()
})

test('abs is absolute value, not a pipe', (t) => {
  check(t, [
    ['the {{abs|x}} value', 'the |x| value'],
    ['{{abs|-3}}', '|-3|'],
  ])
  t.end()
})

test('season-year links shorten the second year', (t) => {
  check(t, [
    ['{{nba year|2001}}', '2001–02'],
    ['{{nbay|2001}}', '2001–02'],
    ['{{nba year|1999}}', '1999–2000'],
    ['{{mhl year|2010}}', '2010–11'],
    ['{{nhl year|2010}}', '2010–11'],
    ['{{nhly|2010}}', '2010–11'],
    ['{{mlby|2010}}', '2010'],
    ['{{nfly|2010}}', '2010'],
  ])
  t.end()
})

test('convert keeps both unit pairs and degree symbols', (t) => {
  check(t, [
    ['{{convert|5|ft|11|in|m|abbr=on}}', '5 ft 11 in'],
    ['{{convert|6|ft|2|in|cm}}', '6 ft 2 in'],
    ['{{convert|10|C|F}}', '10 °C (50 °F)'],
    ['{{convert|98.6|F|C}}', '98.6 °F (37.0 °C)'],
    ['{{convert|37|ft}}', '37 ft (11 m)'],
    ['{{convert|7|and|8|km}}', '7 and 8 km'],
    ['{{convert|7|to|8|C}}', '7 to 8 °C'],
  ])
  t.end()
})

test('val uncertainty and exponent', (t) => {
  check(t, [
    ['{{val|1.234|0.005|u=m}}', '1.234±0.005 m'],
    ['{{val|1.234|e=5|u=m}}', '1.234×10⁵ m'],
    ['{{val|6.674|e=-11}}', '6.674×10⁻¹¹'],
    ['{{val|299792458|u=m/s}}', '299,792,458 m/s'],
  ])
  t.end()
})

test('math is inline', (t) => {
  check(t, [
    ["Let {{math|''x'' + 1}} be a number.", 'Let x + 1 be a number.'],
    ['hello {{math|1 + 2 {{=}} 3}} world', 'hello 1 + 2 = 3 world'],
  ])
  t.end()
})

test('nihongo variants', (t) => {
  check(t, [
    ['{{nihongo|Tokyo|東京|Tōkyō}}', 'Tokyo (東京, Tōkyō)'],
    ['{{nihongo|Tokyo|東京|Tōkyō|lit. "eastern capital"}}', 'Tokyo (東京, Tōkyō, lit. "eastern capital")'],
    ['{{nihongo|Tokyo|東京}}', 'Tokyo (東京)'],
    ['{{nihongo2|東京}}', '東京'],
    ['{{nihongo3|Tokyo|東京|Tōkyō}}', 'Tōkyō (東京, Tokyo)'],
    ['{{nihongo foot|Tokyo|東京|Tōkyō}}', 'Tokyo'],
  ])
  t.end()
})

test('marriage end reasons', (t) => {
  check(t, [
    ['{{marriage|Jane Doe|2001|2010}}', 'Jane Doe (m. 2001–2010)'],
    ['{{marriage|Jane Doe|2001|2010|end=died}}', 'Jane Doe (m. 2001; died 2010)'],
    ['{{marriage|Jane Doe|2001|2010|end=div}}', 'Jane Doe (m. 2001; div. 2010)'],
    ['{{marriage|Jane Doe|2001|2010|end=divorced}}', 'Jane Doe (m. 2001; div. 2010)'],
    ['{{marriage|Jane Doe|2001}}', 'Jane Doe (m. 2001)'],
    ['{{marriage|Jane Doe}}', 'Jane Doe'],
  ])
  t.end()
})

test('height has a space before the unit', (t) => {
  check(t, [
    ['{{height|m=1.80}}', '1.80 m'],
    ['{{height|ft=5|in=11}}', '5 ft 11 in'],
    ['{{height|cm=180}}', '180 cm'],
  ])
  t.end()
})

test('sic parameters', (t) => {
  check(t, [
    ['{{sic|hte}}', 'hte [sic]'],
    ['word {{sic}} here', 'word [sic] here'],
    ['{{sic|hte|nolink=y}}', 'hte [sic]'],
    ['{{sic|hide=y|hte}}', 'hte'],
    ['{{sic|hide=yes|hte}}', 'hte'],
    ['{{sic|hte|?}}', 'hte [sic?]'],
    ['{{sic|?|hte}}', 'hte [sic?]'],
    ['{{sic|Conc|encus}}', 'Concencus [sic]'],
  ])
  t.end()
})

test('currency symbols', (t) => {
  check(t, [
    ['{{EUR|100}}', '€100'],
    ['{{€|100}}', '€100'],
    ['{{currency|100|EUR}}', '€100'],
    ['{{GBP|100}}', '£100'],
    ['{{£|100}}', '£100'],
    ['{{currency|100|GBP}}', '£100'],
    ['{{KRW|100}}', '₩100'],
    ['{{CAD|100}}', 'C$100'],
    ['{{BRL|100}}', 'R$100'],
    ['{{SGD|100}}', 'S$100'],
    ['{{USD|100}}', 'US$100'],
    ['{{USD|100|2020}}', 'US$100'],
    ['{{US$|100|2020|long=no}}', 'US$100'],
    ['{{currency|5|BTC}}', '5 BTC'],
  ])
  const usd = wtf('{{USD|100|2020}}').templates()[0].json()
  t.equal(usd.data.year, '2020', 'inflation year is kept as data')
  t.end()
})

test('lang-fa is persian', (t) => {
  check(t, [
    ['Iran ({{lang-fa|ایران}}) is a country', 'Iran (ایران) is a country'],
    ['{{lang-sux|𒆠𒂗𒄀}}', '𒆠𒂗𒄀'],
  ])
  t.end()
})

test('birth and death dates carry an age', (t) => {
  const now = new Date()
  let age = now.getFullYear() - 2001
  if (now.getMonth() + 1 < 5 || (now.getMonth() + 1 === 5 && now.getDate() < 3)) {
    age -= 1
  }
  t.equal(wtf('{{birth date and age|2001|5|3}}').text(), `May 3, 2001 (age ${age})`, 'birth date and age')
  t.equal(wtf('{{bda|2001|5|3|df=y}}').text(), `3 May 2001 (age ${age})`, 'bda, day-first')
  t.equal(wtf('{{death date and age|2020|5|3|2001|5|3}}').text(), 'May 3, 2020 (aged 19)', 'death date and age')
  t.equal(wtf('{{death date and age|2020|5|3|2001|6|3|df=y}}').text(), '3 May 2020 (aged 18)', 'a birthday not yet reached')
  t.equal(wtf('{{death date and age|2020|5|3}}').text(), 'May 3, 2020', 'no birth date, no age')
  t.end()
})

test('replace with a space', (t) => {
  t.equal(wtf('{{replace|foo_bar|_| }}').text(), 'foo bar', 'whitespace replacement')
  t.end()
})

test('block indent and dms coordinates', (t) => {
  t.equal(wtf('{{block indent|The Cartesian product.}}').text(), 'The Cartesian product.', 'block indent positional')
  t.equal(wtf('{{block indent|1=The Cartesian product.}}').text(), 'The Cartesian product.', 'block indent named')
  t.equal(wtf('{{Coord|36|42|N|3|13|E|type:city_region:DZ}}').text(), '36°42′N 3°13′E', 'coord dm')
  t.equal(wtf('{{coord|40|42|46|N|74|0|21|W}}').text(), '40°42′46″N 74°0′21″W', 'coord dms')
  t.equal(wtf('{{coord|36.7|3.21}}').text(), '36.7°N 3.21°E', 'coord decimal')
  t.equal(wtf('{{coord|40|N|74|W}}').text(), '40°N 74°W', 'coord degrees')
  t.equal(wtf('{{Coord|33|-87|display=title}}').text(), '', 'title coords are not inline')
  t.end()
})
