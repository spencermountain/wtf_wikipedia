var test = require('tape')
var wtf = require('./_lib')

test('sentence-birthDate', (t) => {
  let str = `'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian [[sport]]s [[Senior management|executive]].`
  let date = wtf(str).birthDate()
  t.equal(date.year, 1956, 'circa-template')

  str = `'''David Robert Jones''' (asdf), known professionally as '''David Bowie'''`
  date = wtf(str).birthDate()
  t.equal(date, null, 'no-false-positive')

  str = `'''Samuel Appleton''' (1625 – May 15, 1696) was a military and government leader`
  date = wtf(str).birthDate()
  t.equal(date.year, 1625, 'with death hyphen')

  str = `'''Samuel Appleton''' (born May 1696) was a military and government leader`
  date = wtf(str).birthDate()
  t.equal(date.year, 1696, 'born text')
  t.end()
})

test('template-birthDate', (t) => {
  let str = `{{Infobox officeholder
    | predecessor  = [[Cyril Leeder]]
    | birth_date   = {{birth year and age|1956}}
    | birth_place  = [[Etobicoke]], [[Ontario]], Canada
    | alma_mater   = [[Ryerson University]] and [[University of Saskatchewan]]
    | nationality  = Canadian
  }}`
  let doc = wtf(str)
  let date = doc.birthDate()
  t.equal(date.year, 1956, 'birth year and age')
  t.end()
})

test('category-birthDate', (t) => {
  let doc = wtf(`hello [[Category:1952 births]]    [[Category:Living people]]`)
  let date = doc.birthDate()
  t.equal(date.year, 1952, 'Category:1952 births')
  t.end()
})

test('infobox-deathdate', (t) => {
  let str = `{{Infobox golfer
    | name              = Billy Casper
    | image             = Billy Casper (cropped).jpg{{!}}border
    | imagesize         = <!-- e.g. 250px (default is 200px) -->
    | caption           = Casper in 2008
    | fullname          = William Earl Casper Jr.
    | nickname          = Buffalo Bill
    | birth_date        = {{Birth date|1931|6|24}}
    | birth_place       = [[San Diego, California]]
    | death_date        = {{nowrap|{{Death date and age|2015|2|7|1931|6|24}}}}
    | death_place       = [[Springville, Utah]]
  }}`

  let doc = wtf(str)

  t.equal(doc.infobox().get('birth_date').text(), 'June 24, 1931', 'birth')
  t.equal(doc.infobox().get('death_date').text(), 'February 7, 2015', 'death')

  t.end()
})
