var wtf = require('./src/index')
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

/** add spaces at the end */
const padEnd = function (str, width) {
  str = str.toString()
  while (str.length < width) {
    str += ' '
  }
  return str
}

// 'Tom Anselmi (born c.'
// 'The Tabula Capuana (=Tablet from Capua Ital.'
// ' cuneiform inscription of the Achaemenid King Xerxes I ((r.'

// Alexis Korner
// Arnold Schwarzenegger
// Alf Tales
// André the Giant
// Arbroath Abbey
// Australian Broadcasting Corporation

// 'Chungnam National University (CNU) is a national university located in Daejeon, South Korea.'

;(async () => {
  let cat = await wtf.randomCategory()
  console.log(cat, '\n\n')
  wtf.parseCategory(cat).then((res) => {
    res.docs.forEach((doc) => {
      console.log(doc.sentences(0).text())
      // console.log(padEnd(doc.title(), 26) + '       ' + doc.summary({ article: false }) || '-')
    })
  })
})()

wtf.randomCategory().then((res) => {
  console.log(res)
})
