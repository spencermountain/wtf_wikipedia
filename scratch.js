var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
// wtf.extend(require('./plugins/image/src'))

// let txt = require('fs')
//   .readFileSync('/Users/spencer/mountain/wtf_wikipedia/tests/cache/royal_cinema.txt')
//   .toString()

// let str = `hello [[bs:cool]]`
// console.log(wtf(str).text())

// const doc = wtf('hello [[fr:world]]')
// const doc = wtf('hello [[world]]')

// wtf.fetch('State (website)').then(doc => {
//   console.log(doc.data)
//   console.log(doc.categories())
// let links = doc.links()
// links.map(l => l.json())
// })

// let str = `before [[Datei:Cool.jpg|mini|Michael Jackson in [[link]] text]] after`
// let doc = wtf(str)
// const doc = wtf(` that cat is [http://cool.com a] cool dude`)

let str = `{{Infobox software
  | name = Node.js
  | logo = [[File:Node.js logo.svg|frameless]]
  | author = [[Ryan Dahl]]
  | developer = Various
   }}
`
let doc = wtf(str)
let obj = doc.infobox(0).keyValue()
console.log(obj)
console.log(doc.image().json())
