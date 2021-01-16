const wtf = require('./src/index')
// wtf.extend(require('./plugins/wikis/wikinews'))
wtf.extend(require('./plugins/disambig/src'))

// const plugin = (models, templates) => {
//   // add templates
//   templates.tag = (text, data, c, d) => {
//     console.log(d)
//     return
//   }
// }

// wtf.extend(plugin)

wtf.fetch('Template:2020–21_NHL_North_Division_standings').then((doc) => {
  // console.log(doc.templates())
})

// let doc = wtf(`before {{w|Australia|Australians}} after`)
// console.log(doc.templates())
// console.log(doc.text())
// console.log(doc.reference().json())

// wtf.fetch('Cosmology').then((doc) => {
//   console.log(doc.sections(0)[0].html({ images: false }))
// })
