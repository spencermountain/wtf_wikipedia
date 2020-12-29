const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

// const plugin = (models, templates) => {
//   // add templates
//   templates.tag = (text, data, c, d) => {
//     console.log(d)
//     return
//   }
// }

// wtf.extend(plugin)

// wtf
//   .fetch(
//     // 'https://en.wikinews.org/wiki/Gregory_Kurtzer_discusses_plans_for_Rocky_Linux_with_Wikinews_as_Red_Hat_announces_moving_focus_away_from_CentOS'
//     'https://fr.wiktionary.org/wiki/pasteur'
//   )
//   .then((doc) => {
//     // console.log(doc.templates('ValueDescription'))
//     console.log(doc)
//   })

// console.log(wtf(`{{l|cs|háček}}`).text())

wtf.fetch('Richard_Feynman').then((doc) => {
  console.log(doc.sections(0)[0].text())
})
