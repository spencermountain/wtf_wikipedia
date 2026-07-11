import toJSON from './toJson.js'

//where we store the formatting, link, date information
class Sentence {
  constructor(data = {}) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data,
    })
  }

  links(n) {
    let arr = this.data.links || []
    if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1) //titlecase it
      let link = arr.find((o) => o.page === n)
      return link === undefined ? [] : [link]
    }
    return arr
  }

  link(clue) {
    let arr = this.links(clue)
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  }

  interwiki() {
    return this.links().filter((l) => l.wiki !== undefined)
  }

  bolds() {
    if (this.data && this.data.fmt && this.data.fmt.bold) {
      return this.data.fmt.bold || []
    }
    return []
  }

  bold(clue) {
    let arr = this.bolds(clue)
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  }

  italics() {
    if (this.data && this.data.fmt && this.data.fmt.italic) {
      return this.data.fmt.italic || []
    }
    return []
  }

  italic(clue) {
    let arr = this.italics(clue)
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr[0]
  }

  text(str) {
    if (str !== undefined && typeof str === 'string') {
      //set the text?
      this.data.text = str
    }
    return this.data.text || ''
  }

  plaintext(str) {
    return this.text(str)
  }

  json(options) {
    return toJSON(this, options)
  }

  wikitext() {
    return this.data.wiki || ''
  }

  isEmpty() {
    return this.data.text === ''
  }
}

export default Sentence
