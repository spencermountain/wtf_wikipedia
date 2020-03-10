// var wtf = require('./src/index')
const api = require('./api')
let arr = []
Object.keys(api).forEach(k => {
  arr.push(`## ${k}`)
  api[k].forEach(obj => {
    arr.push(`* **${obj.name}** - ${obj.description || ''}`)
  })
})
console.log(arr.join('\n'))

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
// ;(async () => {
//   var doc = await wtf.fetch('Template:2019–20 coronavirus outbreak data/WHO situation reports')
//   let json = doc.tables().map(table => {
//     return table.json()
//   })
//   console.log(json[0])
// })()
