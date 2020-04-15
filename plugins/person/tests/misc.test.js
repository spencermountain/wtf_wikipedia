var test = require('tape')
var wtf = require('./_lib')

test('sentence-birthDate', (t) => {
  let str = `'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian [[sport]]s [[Senior management|executive]].`
  let doc = wtf(str)
  let date = doc.birthDate()
  t.ok(date.year, 1956, 'circa-template')
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
  t.ok(date.year, 1956, 'birth year and age')
  t.end()
})

test('category-birthDate', (t) => {
  let doc = wtf(`hello [[Category:1952 births]]    [[Category:Living people]]`)
  let date = doc.birthDate()
  t.ok(date.year, 1952, 'Category:1952 births')
  t.end()
})
