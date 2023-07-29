import schema from './index.js'

let mappings = {
  categories: {},
  descriptions: {},
  infoboxes: {},
  sections: {},
  templates: {},
  titles: {},
}
let patterns = {
  categories: [],
  descriptions: [],
  infoboxes: [],
  sections: [],
  templates: [],
  titles: [],
}

const doNode = function (node) {
  // try children patterns first
  if (node.children) {
    Object.keys(node.children).forEach((k) => {
      doNode(node.children[k])
    })
  }
  if (node.id) {
    // collect mappings
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
    // collect patterns
    node.categories.patterns.forEach((reg) => {
      patterns.categories.push([reg, node.id])
    })
    node.descriptions.patterns.forEach((reg) => {
      patterns.descriptions.push([reg, node.id])
    })
    node.infoboxes.patterns.forEach((reg) => {
      patterns.infoboxes.push([reg, node.id])
    })
    node.sections.patterns.forEach((reg) => {
      patterns.sections.push([reg, node.id])
    })
    node.templates.patterns.forEach((reg) => {
      patterns.templates.push([reg, node.id])
    })
    node.titles.patterns.forEach((reg) => {
      patterns.titles.push([reg, node.id])
    })
  }


}
doNode(schema)
export { patterns, mappings }
