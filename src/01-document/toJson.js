import setDefaults from '../_lib/setDefaults.js'

// handy preset outputs, like `.json('md')`
const sizes = {
  sm: {
    title: true,
    description: true,
    infoboxes: true,
    categories: true,
  },
  md: {
    title: true,
    description: true,
    infoboxes: true,
    categories: true,
    coordinates: true,
    images: true,
    links: true,
    templates: true,
    text: true,
    references: true,
  },
  lg: {
    title: true,
    description: true,
    infoboxes: true,
    categories: true,
    coordinates: true,
    images: true,
    links: true,
    templates: true,
    sections: true,
    text: true,
    references: true,
  },
}

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
  let isPreset = false
  if (typeof options === 'string') {
    options = sizes[options] || sizes.md
    isPreset = true
  } else {
    options = setDefaults(options, defaults)
  }
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
  if (options.description) {
    let desc = doc.description()
    // for presets, fall-back to the first sentence when the wikidata description is missing
    if (!desc && isPreset && doc.sentence()) {
      desc = doc.sentence().text()
    }
    if (desc) {
      data.description = desc
    }
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
  if (options.links) {
    data.links = doc.links().map((i) => i.json(options))
  }
  if (options.templates) {
    data.templates = doc.templates().map((i) => i.json(options))
  }
  if (options.plaintext || options.text) {
    let text = doc.text(options)
    if (options.text) {
      data.text = text
    }
    if (options.plaintext) {
      data.plaintext = text //support old plaintext key, too
    }
  }

  return data
}
export default toJSON
