const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))
// wtf.extend(require('./plugins/i18n/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

// wtf.fetch('Toronto Raptors', 'en').then((doc) => {
//   doc.pageViews().then((res) => {
//     console.log(res)
//     console.log('done')
//   })
//   // console.log(doc.lang())
//   // console.log(doc.images().map((j) => j.url()))
// })

// wtf.getTemplatePages('Template:Switzerland-badminton-bio-stub').then((pages) => {
//   wtf.fetchList(pages).then((docs) => {
//     docs.forEach((doc) => console.log(doc.sentences(0).text()))
//   })
// })

// wtf.getCategoryPages('Category:Swiss skeleton racers').then(function (list) {
//   console.log(list)
// })

wtf.getTemplatePages('Template:Switzerland-badminton-bio-stub').then(function (pages) {
  wtf.fetchList(pages).then((docs) => {
    docs.forEach((doc) => {
      let infobox = doc.infobox(0)
      if (infobox && infobox.get('height')) {
        console.log(doc.title(), infobox.get('height').text())
      }
    })
  })
})
