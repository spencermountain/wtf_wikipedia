import parse from './_lib.js'

// Input has already had templates and references processed by its section.
class Block {
  #wiki
  #data

  constructor(wiki = '') {
    this.#wiki = wiki
    this.#data = parse(wiki)
  }

  text() {
    return this.#data.text
  }

  wikitext() {
    return this.#wiki
  }

  // Keep the parsed data private when exposing individual records.
  links() {
    return this.#data.links.map((link) => ({ ...link }))
  }

  link(index = 0) {
    return this.links()[index] || null
  }

  formatting() {
    return this.#data.formatting.map((span) => ({ ...span }))
  }

  isEmpty() {
    return this.text().length === 0
  }

  json() {
    return { text: this.text(), links: this.links(), formatting: this.formatting() }
  }
}

export default Block
