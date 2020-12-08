const boxes = {
  KeyDescription: true,
  ValueDescription: true,
  Place: true,
}

const plugin = (models, templates, infoboxes) => {
  // add infoboxes
  Object.assign(infoboxes, boxes)
  // add templates
  templates.tag = (text, data) => {
    console.log(data)
    return
  }
}
module.exports = plugin
