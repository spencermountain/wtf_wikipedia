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

let obj = wtf(`{{Medical cases chart
  |numwidth=mw

  |disease=Green Flu
  |location=Savannah, GA
  |outbreak=2009 Green Flu outbreak

  |recoveries=n

  |rows=
2009-04-13;;;42;;;42;firstright1=y;divisor=40;numwidth=mw
2009-04-14;;;356;;;356;+748%;divisor=40;numwidth=mw
2009-04-15;;;1503;;;1,503;+322%;divisor=40;numwidth=mw
2009-04-16;57;;5915;;;5,915;+294%;divisor=40;numwidth=mw
2009-04-17;2000;;9500;;;~9,500;+60.6%;divisor=40;numwidth=mw
  }}`).template('medical cases chart')
// console.log(obj)
