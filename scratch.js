const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))
// wtf.extend(require('./plugins/i18n/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

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
