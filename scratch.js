var wtf = require('./src/index')
wtf.extend(require('./plugins/person/src'))

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

let death = doc.deathDate()
console.log(death)

// let place = doc.birthPlace()
// console.log(place)

console.log('alive:', doc.isAlive())

// console.log('nationality:', doc.nationality())
