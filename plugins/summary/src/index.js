const fromTemplate = require('./01-fromTemplate')
const fromText = require('./02-fromText')

const defaults = {
  article: true
}

const seemsGood = function(txt) {
  return txt && txt.length > 5 && txt.length < 55
}

const postProcess = function(txt) {
  txt = txt.trim()
  return txt
}

const plugin = function(models) {
  // add a new method to main class
  models.Doc.prototype.summary = function(options) {
    let doc = this
    options = options || {}
    options = Object.assign({}, defaults, options)

    // generate from {{short description}} template
    let txt = fromTemplate(doc, options)
    if (seemsGood(txt)) {
      return postProcess(txt)
    }
    // generate from first-sentence
    txt = fromText(doc, options)
    if (seemsGood(txt)) {
      return postProcess(txt)
    }

    return ''
  }

  // should we use 'it', 'he', 'they'...
  models.Doc.prototype.article = function(options) {
    return null
  }
  // was event in past? is person dead?
  models.Doc.prototype.tense = function(options) {
    return null
  }
}
module.exports = plugin
