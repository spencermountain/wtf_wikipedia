// const birthDate = require('./birthDate')
const shouldSkip = /see also/

const addMethod = function (models) {
  models.Doc.prototype.disambiguation = function () {
    if (this.isDisambiguation() !== true) {
      return null
    }
    // remove 'see also'
    let s = this.section('see also')
    if (s !== null) {
      s.remove()
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
