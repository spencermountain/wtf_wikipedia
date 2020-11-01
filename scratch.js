const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

// wtf.getTemplatePages('Template:Switzerland-badminton-bio-stub').then(function (pages) {
//   wtf.fetchList(pages).then((docs) => {
//     docs.forEach((doc) => {
//       let infobox = doc.infobox(0)
//       if (infobox && infobox.get('height')) {
//         console.log(doc.title(), infobox.get('height').text())
//       }
//     })
//   })
// })

// wtf.fetch('Toronto Raptors').then((doc) => {
//   console.log(doc)
// })
// const path = require('path')
// const fs = require('fs')
// let str = fs.readFileSync(path.join(__dirname, './tests/cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
// let doc = wtf(str)
// console.log(doc.json().sections[0].paragraphs)
// console.log(doc.sections(0).json())

const str = `
{{Infobox person
  | name             = Jodie Emery
  | birth.date       = January 4, 1985<ref name="facebook"/>
  | known_for        = [[cannabis (drug)|Cannabis]] legalisation
}}
hello world  {{lkjsdf|foo=28|hs.he=90}}.`
let doc = wtf(str)
let json = doc.json({})
// console.log(doc.sections(0).infoboxes())
console.log(json.sections[0])
