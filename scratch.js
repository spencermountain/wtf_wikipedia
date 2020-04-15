var wtf = require('./src/index')
wtf.extend(require('./plugins/person/src'))

let str = `{{Infobox officeholder
  | predecessor  = [[Cyril Leeder]]
  | birth_date   = {{birth year and age|1956}}
  | birth_place  = [[Etobicoke]], [[Ontario]], Canada
  | death_place  = Germany
  | alma_mater   = [[Ryerson University]] and [[University of Saskatchewan]]
  | nationality  = Canadian
}}`
// str = `'''David Robert Jones''' (asdf), known professionally as '''David Bowie'''`
// str = `'''Samuel Appleton''' (1625 – May 15, 1696) was a military and government leader`
// str = `'''Samuel Appleton''' (born May 1696) was a military and government leader`
// str = `'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian`
// str = `Tom Anselmi (born c. 1956) is a Canadian`
// str = `[[Category:1964 births]] [[Category:Living people]]`
// let doc = wtf(str)
// let date = doc.birthDate()
// console.log(date)

// str = `'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian [[sport]]s [[Senior management|executive]]. asdf`
str = `'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian [[sport]]s executive. asdf and also here`
let doc = wtf(str)
console.log(doc.sentences().map((s) => s.text()))
// let date = doc.birthDate()
// console.log(date)
// let death = doc.deathDate()
// console.log(death)

// let place = doc.birthPlace()
// console.log(place)

// console.log('alive:', doc.isAlive())

// console.log('nationality:', doc.nationality())
