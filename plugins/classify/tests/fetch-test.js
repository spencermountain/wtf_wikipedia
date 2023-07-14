import test from 'tape'
import wtf from './_lib.js'

let arr = [
  // biologists
  ['Ernst Haeckel', 'Person/Creator/Author'],
  ['David Haig (biologist)', 'Person'],
  ['Brian K. Hall', 'Person'],
  ['Judith Hand', 'Person/Creator/Author'],
  ['Ilkka Hanski', 'Person'],
  ['Marc Hauser', 'Person'],
  ['Paul D. N. Hebert', 'Person'],
  ['Stephen Blair Hedges', 'Person'],
  ['Willi Hennig', 'Person'],
  ['David Hillis', 'Person'],
  ['Katie Hinde', 'Person'],
  ['David Houle (biologist)', 'Person'],
  ['Sarah Blaffer Hrdy', 'Person'],
  ['Raymond B. Huey', 'Person'],
  ['Silvie Huijben', 'Person'],

  // neighbourhoods in canada
  // ['Bloor West Village', 'Place/Jurisdiction'],
  ['Church and Wellesley', 'Place/Jurisdiction'],
  ['Liberty Village', 'Place/Jurisdiction'],
  // ['Parkdale, Toronto', 'Place/Jurisdiction'],
  ['Rexdale', 'Place/Jurisdiction'],
  ['Calgary', 'Place/Jurisdiction/City'],
  ['Toronto', 'Place/Jurisdiction/City'],
  ['Detroit', 'Place/Jurisdiction/City'],
  ['Leota, Minnesota', 'Place/Jurisdiction'],

  // directors
  ['Bryan Barber', 'Person/Creator/Director'],
  ['Joseph Barbera', 'Person/Creator/Director'],
  ['Wyatt Bardouille', 'Person/Creator/Director'],
  ['Tennyson Bardwell', 'Person/Creator/Director'],
  ['Reginald Barker', 'Person/Creator/Director'],
  // actors
  ['Tajh Bellow', 'Person/Creator/Actor'],
  ['Jeff Bennett', 'Person/Creator/Actor'],
  ['Clint Bickham', 'Person/Creator/Actor'],
  ['Larry Blyden', 'Person/Creator/Actor'],
  ['Larry Brantley', 'Person/Creator/Actor'],
  ['Josh Brener', 'Person/Creator/Actor'],
  ['Françoise Yip', 'Person/Creator/Actor'],
  // films
  ['I Love You to Death', 'Creation/CreativeWork/Film'],
  ['Tune in Tomorrow', 'Creation/CreativeWork/Film'],
  ['Point Break', 'Creation/CreativeWork/Film'],
  ['Bill & Ted\'s Bogus Journey', 'Creation/CreativeWork/Film'],
  ['My Own Private Idaho', 'Creation/CreativeWork/Film'],

  ['2008 City of Melbourne election', 'Event/Election'],
  ['Banque Palatine', 'Organization/Company'],
  ['Osvaldo Belo', 'Person/Athlete/FootballPlayer'],
  // artists
  ['Andrew Norman Wilson (artist)', 'Person/Creator'],
  // ['Pepsi Bethel', 'Person'], //(dancer)
  ['Hortense "Tee" Beveridge', 'Person/Creator/Director'],
  ['Natvar Bhavsar', 'Person/Creator'],
  ['Ashley Bickerton', 'Person/Creator'],
  ['Eve Biddle', 'Person/Creator'],

  ['Immigration and Naturalization Service v. Delgado', 'Event'],
  ['Acacia viscidula', 'Concept/Organism'],
  ['Boston College Eagles baseball', 'Organization/SportsTeam'],
  ['Bishop Michael Eldon School', 'Organization/School'],
  // ['',''],
]

const green = str => '\x1b[32m' + str + '\x1b[0m'
const red = str => '\x1b[31m' + str + '\x1b[0m'
const dim = str => '\x1b[2m' + str + '\x1b[0m'
const blue = str => '\x1b[34m' + str + '\x1b[0m'
const magenta = str => '\x1b[35m' + str + '\x1b[0m'

for (let i = 0; i < arr.length; i += 1) {
  let [name, type] = arr[i]
  let doc = await wtf.fetch(name)
  let res = doc.classify()
  if (res.type === type) {
    console.log(green('• '), dim(name))
  } else {
    console.log('❌ ', dim(name), blue(res.type), magenta(type))
  }
}


