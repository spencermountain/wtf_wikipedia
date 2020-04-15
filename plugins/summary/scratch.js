const fs = require('fs')
const path = require('path')
var wtf = require('../../src/index')
wtf.extend(require('./src'))

// `{{About|the British mathematician  John H. Conway |the American mathematician| John B. Conway|other people named John Conway|John Conway (disambiguation){{!}}John Conway}}`

// 'Chungnam National University (CNU) is a national university located in Daejeon, South Korea.'
// adventure game released by On-Line Systems in 1980
// let str = `The Creston Clippers were a junior 'B' ice hockey team based in Creston, British Columbia, Canada.`
// let str = `Susan Allen (May 10, 1951 &amp;ndash; September 7, 2015) was an American harpist and singer`

// wtf.randomCategory().then((cat) => {
//   wtf.parseCategory(cat).then((res) => {
//     res.docs.forEach((doc) => {
//       console.log(doc.title() + '          ' + doc.summary({ template: false, sentence: false }))
//     })
//   })
// })

let abs = path.join(__dirname, './tests/texts.txt')
let arr = fs
  .readFileSync(abs)
  .toString()
  .split(/\n/)
  .filter((s) => s)
arr.forEach((txt) => {
  let str = wtf(txt).summary({ template: false, sentence: false })
  console.log(str)
})
