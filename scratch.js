// require('pretty-exceptions')
const wtf = require('./src/index')
const languages = Object.keys(require('./src/_data/languages'))
// const wtf = require('./builds/wtf_wikipedia.min')
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// wtf.extend((models, templates) => {
//   templates.foo = ['a', 'b', 'c']
// })
let i = 0
async function doit() {
  try {
    let doc = await wtf.fetch('toronto', languages[i])
    let count = doc.categories().length
    console.log(languages[i], count)
  } catch (e) {
    // console.log('err')
  }
  i += 1
  if (languages[i]) {
    doit(i)
  }
}
doit()

// ;(async () => {
//   try {
//     let doc = await wtf.fetch('toronto', 'aa')
//     console.log(doc.categories())
//   } catch (e) {
//     console.log('end')
//   }
// })()

// let doc = wtf(`known as '''J. J. Abrams'''`)
// console.log(doc.sentences(0).text())
// console.log(doc.text())
