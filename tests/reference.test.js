var test = require('tape')
var wtf = require('./lib')

test('basic-citation', t => {
  var str = `Emery is a vegetarian,<ref>{{cite web|title=The princess of pot|url=http://thewalrus.ca/the-princess-of-pot/}}</ref>`
  var arr = wtf(str)
    .citations()
    .map(c => c.json())
  t.equal(arr.length, 1, 'found-one-citation')
  t.equal(arr[0].type, 'web', 'cite web')
  t.equal(arr[0].title, 'The princess of pot', 'title')
  t.equal(arr[0].url, 'http://thewalrus.ca/the-princess-of-pot/', 'url')
  t.end()
})

test('complex-citation', t => {
  var str = `Emery is a vegetarian,<ref name="fun">{{ cite web|foo =    bar
| url=http://cool.com/?fun=cool/}}</ref>`
  var arr = wtf(str)
    .citations()
    .map(c => c.json())
  t.equal(arr.length, 1, 'found-one-citation')
  t.equal(arr[0].type, 'web', 'cite web')
  t.equal(arr[0].foo, 'bar', 'foo')
  t.equal(arr[0].url, 'http://cool.com/?fun=cool/', 'url')
  t.end()
})

test('multiple-citations', t => {
  var str = `hello {{citation |url=cool.com/?fun=yes/   }}{{CITE book |title=the killer and the cartoons }}`
  var arr = wtf(str)
    .citations()
    .map(c => c.json())
  t.equal(arr.length, 2, 'found-two-citations')
  t.equal(arr[0].url, 'cool.com/?fun=yes/', 'url1')
  t.equal(arr[1].title, 'the killer and the cartoons', 'title2')
  t.end()
})

test('weird-harvard-citations', t => {
  var str = `{{Harvnb|Selin|2008|p=}}{{cite web|url=https://www.thestar.com/news/city_hall/toronto2014election/2014/10/25/mayoral_candidate_john_tory_a_leader_from_childhood.html|title=Mayoral candidate John Tory a leader from childhood|newspaper=Toronto Star|date=October 25, 2014|first=Linda|last=Diebel|accessdate=October 28, 2014}}</ref>`
  var arr = wtf(str)
    .citations()
    .map(c => c.json())
  t.equal(arr.length, 2, 'found-two-citations')
  t.equal(arr[0].author, 'Selin', 'refn author')
  t.equal(arr[0].year, '2008', 'refn year')
  t.end()
})
test('crazy-long-citations', t => {
  var str = `{{Begriffsklärungshinweis}}
  [[Datei:Michael Jackson in 1988.jpg|mini|Michael Jackson in [[Wien]] (1988)]]
  [[Datei:Michael Jackson signature.svg|rahmenlos|rechts|Michael Jacksons Unterschrift (2002)]]
  '''Michael Joseph<ref> "Einige Fans bestehen darauf, dass Michael Jacksons Zweitname ''Joe'' und nicht ''Joseph'' lautet. Aber Michael wurde Anfang der 1990er Jahre bei einer eidesstattlichen Aussage, bei der es um die Urheberrechte zu seinem Song ''Dangerous'' ging, gebeten, seinen vollen Namen auszusprechen, und er sagte klar und deutlich ''Michael Joseph Jackson''. In einigen seiner Ausweise (z.&nbsp;B. Führerschein, Motown-Mitgliedskarte) stand zwar ''Joe'' (was des Öfteren für Verwirrung sorgte), aber ''Joe'' ist die Abkürzung von ''Joseph''. Die Staatsanwaltschaft übernahm beim Prozess 2005 diese Schreibweise, weil ''Joe'' in Michaels Ausweis vermerkt war, den sie im Dezember 2003 konfisziert hatten. In den Geburtsurkunden seiner drei Kinder steht als Name des Vaters ''Michael Joseph Jackson''. Auch in seiner Heiratsurkunde mit Lisa Marie Presley steht ''Joseph'' als Zweitname." Zitiert nach Pade & Risi, Make that change, S. 563 </ref> Jackson'''`
  var doc = wtf(str)
  t.equal(doc.citations().length, 1, 'found-one-citations')
  t.equal(doc.text(), 'Michael Joseph Jackson', 'ref removal good')
  t.equal(doc.images().length, 2, 'got both images')
  t.end()
})

test('inline-test', t => {
  var str = ` {{cite gnis|id=1145117|name=Little Butte Creek|entrydate=November 28, 1980|accessdate=September 26, 2009}}
  * {{cite journal|url=https://nrimp.dfw.state.or.us/web%20stores/data%20libraries/files/Watershed%20Councils/Watershed%20Councils_311_DOC_200-041Assess.zip|format=[[Zip (file format)|ZIP]]|publisher=Little Butte Creek Watershed Council|title=Little Butte Creek Watershed Assessment|date=August 2003|accessdate=September 20, 2009|}}
  `
  var refs = wtf(str)
    .references()
    .map(r => r.json())
  t.equal(refs.length, 2, 'got both refs')
  t.equal(refs[0].entrydate, 'November 28, 1980', 'got data')
  t.equal(refs[1].date, 'August 2003', 'got data 2')
  t.end()
})
// test('inline-test', t => {
//   var str = `"Through Magic Doorways".<ref name="quote">[http://www.imdb.com/name/nm3225194/ Allen Morris IMDb profile]</ref> `;
//   var arr = wtf(str).citations();
//   t.equal(arr.length, 1, 'found-inline-citations');
//   t.equal(arr[0].links(0).site, 'http://www.imdb.com/name/nm3225194/', 'inline-url');
//   t.equal(arr[0].text(), 'Allen Morris IMDb profile', 'inline-text');
//   t.end();
// });
//
// test('inline-test2', t => {
//   var str = `in 1826.<ref name="brake">Brake (2009)</ref>  `;
//   var arr = wtf(str).citations();
//   t.equal(arr.length, 1, 'found-inline-citations');
//   t.equal(arr[0].text(), 'Brake (2009)', 'inline-text');
//   t.end();
// });

// test('inline harder-citation', t => {
//   var str = `<ref name="ChapmanRoutledge">Siobhan Chapman, {{ISBN|0-19-518767-9}}, [https://books.google.com/books?id=Vfr Google Print, p. 166]</ref> She continued her education after.`;
//   var arr = wtf(str).citations();
//   t.equal(arr.length, 1, 'found-one-citation');
//   t.equal(arr[0].links(0).site, 'https://books.google.com/books?id=Vfr', 'fould late link');
//   t.end();
// });
