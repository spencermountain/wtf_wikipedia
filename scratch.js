var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/image/src'))

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

const doc = wtf('hello [http://cool.com ext] and [[File:cool.jpg]]  [[int]] and [[fr:french]]')
console.log(doc.data)
console.log(doc.images(0).json())
// const doc = wtf(`
// *[https://twitter.com/state  @State]`)
// console.log(doc.links().map(l => l.href()))
