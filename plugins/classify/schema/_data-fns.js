const schema = require('./index')

let mappings = {
  categories: {},
  descriptions: {},
  infoboxes: {},
  sections: {},
  templates: {},
  titles: {},
}
let patterns = {
  categories: {},
  descriptions: {},
  infoboxes: {},
  sections: {},
  templates: {},
  titles: {},
}

const doNode = function (node) {
  if (node.id) {
    console.log(node.name)
    node.categories.mapping.forEach((str) => {
      mappings.categories[str] = node.id
    })
    node.descriptions.mapping = node.descriptions.mapping || []
    node.descriptions.mapping.forEach((str) => {
      mappings.descriptions[str] = node.id
    })
    node.infoboxes.mapping.forEach((str) => {
      mappings.infoboxes[str] = node.id
    })
    node.sections.mapping.forEach((str) => {
      mappings.sections[str] = node.id
    })
    node.templates.mapping.forEach((str) => {
      mappings.templates[str] = node.id
    })
    node.titles.mapping.forEach((str) => {
      mappings.titles[str] = node.id
    })
  }

  if (node.children) {
    Object.keys(node.children).forEach((k) => {
      doNode(node.children[k])
    })
  }
}
doNode(schema)

module.exports = { patterns, mappings }
console.log(mappings)
