const nlp = require('compromise')
const fromTemplate = require('./template')
const fromSentence = require('./sentence')
const fromCategory = require('./category')

const defaults = {
  article: true,
  template: true,
  sentence: true,
  category: true,
  max: 80,
  min: 3
}

const seemsGood = function (txt, options) {
  return txt && txt.length > 5 && txt.length < options.max
}

const plugin = function (models) {
  // add a new method to main class
  models.Doc.prototype.summary = function (options) {
    let doc = this
    options = options || {}
    options = Object.assign({}, defaults, options)

    // generate from {{short description}} template
    let txt = ''
    if (options.template) {
      txt = fromTemplate(doc, options)
      if (seemsGood(txt, options)) {
        return txt.trim()
      }
    }
    // generate from first-sentence
    if (options.sentence) {
      txt = fromSentence(doc, options)
      if (seemsGood(txt, options)) {
        return txt.trim()
      }
    }
    if (options.category) {
      return fromCategory(doc, options)
    }
    return ''
  }

  // should we use 'it', 'he', 'they'...
  models.Doc.prototype.article = function () {
    let txt = ''
    // prefer the 2nd sentence
    if (this.sentences(1)) {
      txt = this.sentences(1).text()
    } else {
      txt = this.sentences(0).text()
    }
    let doc = nlp(txt)
    let found = doc.match('(#Pronoun|#Article)').eq(0).text().toLowerCase()
    return found || 'it'
  }

  // was event in past? is person dead?
  models.Doc.prototype.tense = function () {
    let txt = this.sentence().text()
    let doc = nlp(txt)
    let copula = doc.match('#Copula+').first()
    if (copula.has('was')) {
      return 'Past'
    }
    let vb = doc.verbs(0)
    if (vb.has('#PastTense')) {
      return 'Past'
    }
    if (doc.has('will #Adverb? be') || doc.has('(a|an) (upcoming|planned)')) {
      return 'Future'
    }
    return 'Present'
  }
}
module.exports = plugin
