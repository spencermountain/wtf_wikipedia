let schema = {
  children: {
    Person: require('./Person'),
    Place: require('./Place'),
    Organization: require('./Organization'),
    Event: require('./Event'),
    Creation: require('./Creation'),
  },
}

// generate slash-based ids by descending recursively
const setId = function (root, id) {
  if (root.name) {
    root.id = id + '/' + root.name
  } else {
    root.id = ''
  }
  if (root.children) {
    Object.keys(root.children).forEach((k) => {
      setId(root.children[k], root.id)
    })
  }
  return root
}

schema = setId(schema, '')

module.exports = schema
