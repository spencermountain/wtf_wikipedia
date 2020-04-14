var wtf = require('./src/index')
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

// 'Tom Anselmi (born c.'
// 'The Tabula Capuana (=Tablet from Capua Ital.'
// ' cuneiform inscription of the Achaemenid King Xerxes I ((r.'
//`Dalian No. 8 Senior High School (Chinese:大连市第八高级中学) `

// Alexis Korner
// Arnold Schwarzenegger
// Alf Tales
// André the Giant
// Arbroath Abbey
// Australian Broadcasting Corporation

// 'Chungnam National University (CNU) is a national university located in Daejeon, South Korea.'
// adventure game released by On-Line Systems in 1980

// let str=`The Abbotsford Flyers were a Junior "A" ice hockey team from Abbotsford, British Columbia, Canada.`
// let str = `The Creston Clippers were a junior 'B' ice hockey team based in Creston, British Columbia, Canada.`
// let str = `Susan Allen (May 10, 1951 &amp;ndash; September 7, 2015) was an American harpist and singer`

let str = `'''Toronto''' ({{IPAc-en|t|ɵ|ˈ|r|ɒ|n|t|oʊ}}, {{IPAc-en|local|ˈ|t|r|ɒ|n|oʊ}}) is the [[List of the 100 largest municipalities in Canada by population|most populous city]] in [[Canada]] and the [[Provinces and territories of Canada|provincial]] [[capital city|capital]] of [[Ontario]]. `

// console.log(str.length)
let res = wtf(str).summary({})
// console.log(res.length)
console.log(res)

//
// wtf.fetch('Garage (fanzine)').then((doc) => {
//   console.log(doc.summary({ template: false, sentence: false }))
// })

// wtf.randomCategory().then((cat) => {
//   wtf.parseCategory(cat).then((res) => {
//     res.docs.forEach((doc) => {
//       console.log(doc.title() + '          ' + doc.summary({ template: false, sentence: false }))
//     })
//   })
// })

// wtf.fetch('Template:2019–20 coronavirus pandemic data/United States/California medical cases chart').then((doc) => {
//   console.log(doc.template('medical cases chart'))
// })
