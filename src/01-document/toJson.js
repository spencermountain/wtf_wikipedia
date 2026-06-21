import setDefaults from '../_lib/setDefaults.js'

const defaults = {
  title: true,
  sections: true,
  pageID: true,
  categories: true,
  wikidata: true,
  description: true,
  revisionID: false,
  timestamp: false,
  pageImage: false,
  domain: false,
  language: false,
}

// an opinionated output of the most-wanted data
const toJSON = function (doc, options) {
  options = setDefaults(options, defaults)

  let data = {}

  if (options.title) {
    data.title = doc.title()
  }

  // present only if true
  if (doc.isRedirect() === true) {
    data.isRedirect = true
    data.redirectTo = doc.redirectTo()
    data.sections = []
  }
  if (doc.isStub() === true) {
    data.isStub = true
  }
  if (doc.isDisambiguation() === true) {
    data.isDisambiguation = true
  }

  // metadata
  if (options.pageID && doc.pageID()) {
    data.pageID = doc.pageID()
  }
  if (options.wikidata && doc.wikidata()) {
    data.wikidata = doc.wikidata()
  }
  if (options.revisionID && doc.revisionID()) {
    data.revisionID = doc.revisionID()
  }
  if (options.timestamp && doc.timestamp()) {
    data.timestamp = doc.timestamp()
  }
  if (options.description && doc.description()) {
    data.description = doc.description()
  }

  // page sections
  if (options.categories) {
    data.categories = doc.categories()
  }
  if (options.sections) {
    data.sections = doc.sections().map((i) => i.json(options))
  }
  if (options.infoboxes) {
    data.infoboxes = doc.infoboxes().map((i) => i.json(options))
  }
  if (options.images) {
    data.images = doc.images().map((i) => i.json(options))
  }
  if (options.citations || options.references) {
    data.references = doc.references()
  }
  if (options.coordinates) {
    data.coordinates = doc.coordinates()
  }

  if (options.plaintext) {
    data.plaintext = doc.text(options)
  }

  return data
}
export default toJSON
