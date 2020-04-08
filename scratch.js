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
// console.log(str.length)
// let res = wtf(str).summary({})
// console.log(res.length)
// console.log(res)

//
wtf.fetch('Garage (fanzine)').then((doc) => {
  console.log(doc.summary({ template: false, sentence: false }))
})

// wtf.randomCategory().then((cat) => {
//   wtf.parseCategory(cat).then((res) => {
//     res.docs.forEach((doc) => {
//       console.log(doc.title() + '          ' + doc.summary({ template: false, sentence: false }))
//     })
//   })
// })
