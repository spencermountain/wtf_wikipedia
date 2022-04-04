import setDefaults from '../_lib/setDefaults.js'
import encodeObj from '../_lib/encode.js'

const defaults = {
  headers: true,
  depth: true,
  paragraphs: true,
  images: true,
  tables: true,
  templates: true,
  infoboxes: true,
  lists: true,
  references: true,
}

/**
 *
 * @param {object} section
 * @param {object} options
 * @returns {object}
 */
const toJSON = function (section, options) {
  options = setDefaults(options, defaults)
  /**
   * @type {object}
   */
  let data = {}

  if (options.headers === true) {
    data.title = section.title()
  }

  if (options.depth === true) {
    data.depth = section.depth()
  }

  //these return objects
  if (options.paragraphs === true) {
    let paragraphs = section.paragraphs().map((p) => p.json(options))
    if (paragraphs.length > 0) {
      data.paragraphs = paragraphs
    }
  }

  //image json data
  if (options.images === true) {
    let images = section.images().map((img) => img.json(options))
    if (images.length > 0) {
      data.images = images
    }
  }

  //table json data
  if (options.tables === true) {
    let tables = section.tables().map((t) => t.json(options))
    if (tables.length > 0) {
      data.tables = tables
    }
  }

  //template json data
  if (options.templates === true) {
    let templates = section.templates().map((tmpl) => tmpl.json())
    if (templates.length > 0) {
      data.templates = templates
      //encode them, for mongodb
      if (options.encode === true) {
        data.templates.forEach((t) => encodeObj(t))
      }
    }
  }
  //infobox json data
  if (options.infoboxes === true) {
    let infoboxes = section.infoboxes().map((i) => i.json(options))
    if (infoboxes.length > 0) {
      data.infoboxes = infoboxes
    }
  }
  //list json data
  if (options.lists === true) {
    let lists = section.lists().map((list) => list.json(options))
    if (lists.length > 0) {
      data.lists = lists
    }
  }
  //list references - default true
  if (options.references === true || options.citations === true) {
    let references = section.references().map((ref) => ref.json(options))
    if (references.length > 0) {
      data.references = references
    }
  }
  //default off
  if (options.sentences === true) {
    data.sentences = section.sentences().map((s) => s.json(options))
  }
  return data
}
export default toJSON
