var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))
// var arr = [
// '2008-British-motorcycle-Grand-Prix'//Event
// 'Allen-R.-Morris'//Person
// 'al_Haytham'
// 'Alsea-(company)',
// 'Altimont-Butler',
// 'Antique-(band)',
// 'Anwar_Kamal_Khan',
// 'Arts_Club_of_Chicago',
// 'BBDO',
// 'Bazooka',
// 'Bodmin',
// 'Bradley-(community),-Lincoln-County,-Wisconsin',
// 'Britt-Morgan',
// 'Canton-of-Etaples',
// 'Charlie-Milstead',
// 'Chemical-biology',
// 'Clint-Murchison-Sr.',
// 'Damphu-drum'
// ]
// arr.forEach(file => {
//   let txt = require('fs')
//     .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
//     .toString()
//   let doc = wtf(txt)
//   let res = doc.classify()
//   console.log(res)
// })

// wtf.fetch('Glastonbury', 'fr').then(doc => {
//   // doc.classify()
//   console.log(doc.text())
//   //{
//   //  type: 'Organization/SportsTeam',
//   //  confidence: 0.9,
//   //}
// })

// ---missing--
// Chitimukulu
// Zarzycki
// Average wholesale price

// wtf.fetch('Pacific angelshark').then(doc => {
//   console.log(doc.classify())
// })
// wtf.random().then(doc => {
//   console.log(doc.title())
//   console.log(doc.categories())
//   // console.log(doc.summary({ article: false }))
//   console.log(doc.classify())
// })

/*
* interwiki links
* disambiguation templates 

*/

let str = `
{{lang|fr|Je suis française.}}
`

// {{val|123456.78901}}
// {{Authority control |VIAF=66861474 |LCCN=n/87/142671 |ISNI=0000 0001 0911 2808 |GND=117421863 |SUDOC=090162897 }}

// {{rp|23}}

// {{Place name disambiguation}}
// {{transl|ar|al-Khwarizmi}}
// {{Airport disambiguation}}

// {{Medical cases chart
//   |numwidth=mw

//   |disease=Green Flu
//   |location=Savannah, GA
//   |outbreak=2009 Green Flu outbreak

//   |recoveries=n

//   |rows=
//   {{Medical cases chart/Row|2009-04-13|||42|||42|firstright1=y|divisor=40|numwidth=mw}}
//   {{Medical cases chart/Row|2009-04-14|||356|||356|+748%|divisor=40|numwidth=mw}}
//   {{Medical cases chart/Row|2009-04-15|||1503|||1,503|+322%|divisor=40|numwidth=mw}}
//   {{Medical cases chart/Row|2009-04-16|57||5915|||5,915|+294%|divisor=40|numwidth=mw}}
//   {{Medical cases chart/Row|2009-04-17|2000||9500|||~9,500|+60.6%|divisor=40|numwidth=mw}}
//   }}

// str = `{{flagathlete|[[Michael Phelps]]|USA}}`
let doc = wtf(str)
console.log(doc.text())
// console.log(doc.templates())
// console.log(doc.infobox())
// wtf.parseCategory('Major League Baseball venues').then(docs => {
//   let arr = docs.map(doc => {
//     return doc.sentence().text()
//   })
//   console.log(arr)
// [
//  'Fenway park is a sports complex and major league baseball stadium...',
//  'Rogers Center is a entertainment venue ...'
//]
// })
;(async () => {
  let docs = await wtf.fetch(['Target Field', 'Tokyo Dome', 'Tropicana Field'])
  console.log(docs.map(doc => doc.title()))
})()
