import Person from './Person/index.js'
import Place from './Place/index.js'
import Organization from './Organization/index.js'
import Event from './Event/index.js'
import Creation from './Creation/index.js'

let schema = {
  children: {
    Person,
    Place,
    Organization,
    Event,
    Creation,
  },
}

// generate slash-based ids by descending recursively
function setId (root, id) {
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

export default schema
