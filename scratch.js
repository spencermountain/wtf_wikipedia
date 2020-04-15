var wtf = require('./src/index')
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/classify/src'))
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

// let str = `'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian [[sport]]s [[Senior management|executive]].`
// let doc = wtf(str)
// console.log(doc.text())

wtf.fetch('Billy Elliot').then((doc) => {
  let res = doc.classify() // 'CreativeWork/Play'
  if (res.root === 'Person') {
    console.log(doc.birthPlace())
  }
})

// wtf.fetch('Garage (fanzine)').then((doc) => {
//   console.log(doc.summary({ template: false, sentence: false }))
// })
