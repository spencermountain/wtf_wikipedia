import toJSON from './toJson.js'
import setDefaults from '../_lib/setDefaults.js'
const defaults = {
  sentences: true,
  lists: true,
  images: true,
}

//return the first, or n-th element of an array
const getNth = function (arr, clue) {
  if (typeof clue === 'number') {
    return arr[clue]
  }
  return arr[0]
}

class Paragraph {
  constructor(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data,
    })
  }

  sentences() {
    return this.data.sentences || []
  }

  sentence(clue) {
    return getNth(this.sentences(clue), clue)
  }

  references() {
    return this.data.references
  }

  reference(clue) {
    return getNth(this.references(clue), clue)
  }

  citations(clue) {
    return this.references(clue)
  }

  citation(clue) {
    return getNth(this.citations(clue), clue)
  }

  lists() {
    return this.data.lists
  }

  list(clue) {
    return getNth(this.lists(clue), clue)
  }

  images() {
    return this.data.images || []
  }

  image(clue) {
    return getNth(this.images(clue), clue)
  }

  links(clue) {
    let arr = []
    this.sentences().forEach((s) => {
      arr = arr.concat(s.links(clue))
    })
    if (typeof clue === 'string') {
      //grab a specific link like .links('Fortnight')
      clue = clue.charAt(0).toUpperCase() + clue.substring(1) //titlecase it
      let link = arr.find((o) => o.page() === clue)
      return link === undefined ? [] : [link]
    }
    return arr || []
  }

  link(clue) {
    return getNth(this.links(clue), clue)
  }

  interwiki() {
    let arr = []
    this.sentences().forEach((s) => {
      arr = arr.concat(s.interwiki())
    })
    return arr || []
  }

  text(options) {
    options = setDefaults(options, defaults)
    let str = this.sentences()
      .map((s) => s.text(options))
      .join(' ')
    this.lists().forEach((list) => {
      str += '\n' + list.text()
    })
    return str
  }

  json(options) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }

  wikitext() {
    return this.data.wiki
  }
}

export default Paragraph
