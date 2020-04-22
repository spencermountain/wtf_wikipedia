var test = require('tape')
var wtf = require('./lib')

test('sentence parser', (t) => {
  ;[
    ['Tony is nice. He lives in Japan.', 2],
    ['I like that Color', 1],
    ['Soviet bonds to be sold in the U.S. market. Everyone wins.', 2],
    [
      "Hi there Dr. Joe, the price is 4.59 for N.A.S.A. Ph.Ds. I hope that's fine, etc. and you can attend Feb. 8th. Bye",
      3,
    ],
    ['Mount Sinai Hospital, [[St. Michaels Hospital (Toronto)|St. Michaels Hospital]], North York', 1],
    ['he said ... oh yeah. I did', 2],
    ['32 C', 1],
    ['dom, kon. XIX w.', 2],
    [`'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian [[sport]]s [[Senior management|executive]]. asdf`, 2],
    ['a staged reenactment of [[Perry v. Brown]] world', 1],
  ].forEach((a) => {
    var s = wtf(a[0]).sentences()
    var msg = a[1] + ' sentences  - "' + a[0] + '"'
    t.equal(s.length, a[1], msg)
  })
  t.end()
})

test('misc cleanup', (t) => {
  ;[
    // ['hi [[as:Plancton]] there', 'hi there'],
    ['hello <br/> world', 'hello world'],
  ].forEach((a) => {
    var s = wtf(a[0]).text()
    t.equal(s, a[1], 'inline interwiki link')
  })
  t.end()
})

test('redirects', (t) => {
  ;[
    ['#REDIRECT[[Tony Danza]]', 'Tony Danza'],
    ['#REDIRECT [[Tony Danza]]', 'Tony Danza'],
    ['#REDIRECT   [[Tony Danza]] ', 'Tony Danza'],
    ['#redirect   [[Tony Danza]] ', 'Tony Danza'],
    ['#redirect [[Tony Danza#funfun]] ', 'Tony Danza'],
    ['#přesměruj [[Tony Danza#funfun]] ', 'Tony Danza'],
    ['#تغییر_مسیر [[Farming]] ', 'Farming'],
  ].forEach((a) => {
    var o = wtf(a[0])
    var msg = "'" + a[0] + "' -> '" + o.redirect + "'"
    t.equal(o.redirectTo().page, a[1], msg)
  })
  t.end()
})

test('parse_line_text', (t) => {
  ;[
    ['tony hawk', 'tony hawk'],
    [' tony hawk ', 'tony hawk'],
    ['it is [[tony hawk]] ', 'it is tony hawk'],
    ['it is [[tony hawk|tony]] ', 'it is tony'],
    ['it is [[tony danza|tony]] [[hawk]]', 'it is tony hawk'],
    ['tony hawk [http://www.whistler.ca]', 'tony hawk'],
    ['tony hawk in [http://www.whistler.ca whistler]', 'tony hawk in whistler'],
    ['it is [[Tony Hawk|Tony]]s mother in [[Toronto]]s', 'it is Tonys mother in Torontos'],
  ].forEach((a) => {
    var text = wtf(a[0]).plaintext()
    var msg = "'" + a[0] + "' -> '" + text + "'"
    t.equal(text, a[1], msg)
  })
  t.end()
})

test('parse_categories', (t) => {
  ;[
    ['[[Category:Tony Danza]]', ['Tony Danza']],
    ['[[Category:Tony Danza]][[Category:Formal Wear]]', ['Tony Danza', 'Formal Wear']],
    [' [[Category:Tony Danza]]  [[Category:Formal Wear]] ', ['Tony Danza', 'Formal Wear']],
    [' [[Category:Tony Danza|metadata]]  [[category:Formal Wear]] ', ['Tony Danza', 'Formal Wear']],
    ['[[categoría:Tony Danza|metadata]]  ', ['Tony Danza']],
  ].forEach((a) => {
    var cats = wtf(a[0]).categories()
    t.deepEqual(cats, a[1])
  })
  t.end()
})

test('parse_image', (t) => {
  ;[
    ['[[File:Tony Danza]]', 'File:Tony Danza'],
    ['[[Image:Tony Danza]]', 'Image:Tony Danza'],
    ['[[Image:Tony Danza|left]]', 'Image:Tony Danza'],
    [
      '[[Image:Edouard Recon (2002).jpg|right|thumb|200px|Tropical Storm Edouard seen by [[Hurricane Hunters]]]]',
      'Image:Edouard Recon (2002).jpg',
    ],
  ].forEach((a) => {
    var arr = wtf(a[0])
      .images()
      .map((o) => o.file())
    t.deepEqual(arr[0], a[1])
  })
  t.end()
})

test('xml', (t) => {
  ;[
    ['North America,<ref name="fhwa"/> and one of', 'North America, and one of'],
    ['North America,<br /> and one of', 'North America, and one of'],
    ['hello <h2>world</h2>', 'hello world'],
    [`hello<ref name="theroyal"/> world5, <ref name="">nono</ref> man`, 'hello world5, man'],
    ['hello <ref>nono!</ref> world1.', 'hello world1.'],
    ["hello <ref name='hullo'>nono!</ref> world2.", 'hello world2.'],
    ["hello <ref name='hullo'/>world3.", 'hello world3.'],
    ["hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4.", 'hello world4.'],
    ["hello<ref name=''/> world5", 'hello world5'],
  ].forEach((a, i) => {
    var s = wtf(a[0]).plaintext()
    t.equal(s, a[1], 'xml' + i)
  })
  t.end()
})

test('interwiki', (t) => {
  var str = 'hello [[wikinews:Radiohead]] world  [[Category:Films]]'
  var obj = wtf(str)
  t.equal(obj.sections(0).interwiki(0).page(), 'Radiohead', 'interwiki-link')
  t.equal(obj.sections(0).interwiki(0).wiki(), 'wikinews', 'interwiki-link')
  t.equal(obj.categories().length, 1, 'cat-length')
  t.equal(obj.categories(0), 'Films', 'cat-match')
  t.end()
})

test('inline-templates', (t) => {
  var str = `hello {{ill|Article title|language code}} world {{Sfn|Rolling Stone|2004}}`
  var have = wtf(str).plaintext()
  t.equal('hello Article title world', have, 'harvard-references')
  t.end()
})
