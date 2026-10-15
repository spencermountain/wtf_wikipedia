import parse from './_lib.js'
import Collection from '../collection/Collection.js'
import splitSentences from '../04-sentence/parse.ts'
// import extractReferences from '../reference/extract.ts'

// Input has ordinary templates expanded, but retains inline reference tags.
class Block {
  #wiki
  #data

  constructor(wiki = '') {
    this.#wiki = wiki
    this.#data = parse(this.#wiki)
  }

  text() {
    return this.#data.text
  }

  wikitext() {
    // Expose the preprocessed fragment, with reference bodies removed.
    return this.#wiki
  }

  // Split reference-free wikitext; citations stay on the original block.
  sentences() {
    const arr = splitSentences(this.#wiki).map((wiki) => new Block(wiki))
    return Collection.from(arr)
  }

  // Keep the parsed data private when exposing individual records.
  links(selector) {
    const arr = this.#data.links.map((link) => ({ ...link }))
    return Collection.from(arr).select(selector)
  }

  formatting() {
    return this.#data.formatting.map((span) => ({ ...span }))
  }

  json() {
    return {
      text: this.text(),
      links: this.links(),
      formatting: this.formatting(),
    }
  }
}

export default Block
