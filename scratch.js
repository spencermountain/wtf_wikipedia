var wtf = require('./src/index')
wtf.extend(require('./plugins/person/src'))

let str = `{{Infobox officeholder
  | predecessor  = [[Cyril Leeder]]
  | birth_date   = {{birth year and age|1956}}
  | birth_place  = [[Etobicoke]], [[Ontario]], Canada
  | alma_mater   = [[Ryerson University]] and [[University of Saskatchewan]]
  | nationality  = Canadian
}}`
let doc = wtf(str)
let date = doc.birthDate()
console.log(date)
