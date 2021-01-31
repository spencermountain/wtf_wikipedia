// const birthDate = require('./birthDate')
const shouldSkip = /see also/

const addMethod = function (models) {
  // parse a disambiguation page into an array of pages
  models.Doc.prototype.disambiguation = function () {
    if (this.isDisambiguation() !== true) {
      return null
    }
    // remove 'see also'
    let sec = this.section('see also')
    if (sec !== null) {
      sec.remove()
    }
    let pages = []
    this.sections().forEach((s) => {
      let title = s.title()
      if (shouldSkip.test(title) === true) {
        return
      }
      s.lists().forEach((list) => {
        list.lines().forEach((line) => {
          console.log(line.link().text())
        })
        // console.log(list)
      })
    })
    return {}
  }
  // alias
  models.Doc.prototype.disambig = models.Doc.prototype.disambiguation
}
module.exports = addMethod
