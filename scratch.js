var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/summary/src'))
var arr = [
  '2008-British-motorcycle-Grand-Prix',
  'AACTA-Award-for-Outstanding-Achievement-in-Short-Film-Screen-Craft',
  'Alanine—oxo-acid-transaminase',
  'Alexander-Y-Type',
  'Allen-R.-Morris',
  'al_Haytham',
  'Alsea-(company)',
  'Altimont-Butler',
  'Antique-(band)',
  'Anwar_Kamal_Khan',
  'Arts_Club_of_Chicago',
  'BBDO',
  'Bazooka',
  'Bodmin',
  'Bradley-(community),-Lincoln-County,-Wisconsin',
  'Britt-Morgan',
  'Canton-of-Etaples',
  'Charlie-Milstead',
  'Chemical-biology',
  'Clint-Murchison-Sr.',
  'Damphu-drum',

  'Chemical-biology',
  'Clint-Murchison-Sr.',
  'Damphu-drum',
  'Direct-representation',
  'Dollar-Point,-California',
  'Elizabeth-Gilbert',
  'Ewelina-Setowska-Dryk',
  'Goryeo-ware',
  'Gregory-Serper',
  'HMS-Irresistible',
  'Harry-McPherson',
  'History-of-rugby-union-matches-between-Scotland-and-Wales',
  'Irina-Saratovtseva',
  'Jerry-Mumphrey',
  'K.-Nicole-Mitchell',
  'Keilwelle',
  'Liste-der-argentinischen-Botschafter-in-Chile',
  'Magnar-Saetre',
  'Mark-Behr',
  'Maurische-Netzwuhle',
  'Mozilla-Firefox',
  'Neil-McLean-(saxophonist)',
  'RNDIS',
  'Remote-Application-Programming-Interface',
  'Remote-Data-Objects',
  'Remote-Data-Services',
  'Routing-and-Remote-Access-Service',
  'Runtime-Callable-Wrapper',
  'Sara-C.-Bisel',
  'Senate_of_Pakistan',
  'Terrence-Murphy-(American-football)',
  'Teymanak-e-Olya',
  'The-Atlas-(newspaper)',
  'The-Field-of-Waterloo',
  'Tour-EP-(Band-of-Horses-EP)',
  'University-of-Nevada,-Reno-Arboretum',
  'Wendy-Mogel',
  'africaans'
]
// arr.forEach(file => {
//   let txt = require('fs')
//     .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
//     .toString()
//   let doc = wtf(txt)
//   let res = doc.classify()
//   console.log(res)
// })

wtf.fetch('Phalmuter').then(doc => {
  // console.log(doc.summary({ article: false }))
  console.log(doc.classify())
})

/*
* interwiki links
* disambiguation templates 

*/

// let str = `
// {{lang|fr|Je suis française.}}

// {{val|123456.78901}}
// {{Authority control |VIAF=66861474 |LCCN=n/87/142671 |ISNI=0000 0001 0911 2808 |GND=117421863 |SUDOC=090162897 }}

// {{rp|23}}

// {{Place name disambiguation}}
// {{transl|ar|al-Khwarizmi}}
// {{Airport disambiguation}}
// `

// str = `{{flagathlete|[[Michael Phelps]]|USA}}`
// let doc = wtf(str)
// console.log(doc.text())
// console.log(doc.templates())
// console.log(doc.infobox())
