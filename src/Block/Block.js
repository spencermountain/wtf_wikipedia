import parse from './_lib.js'
import splitSentences from '../04-sentence/parse.ts'
import extractReferences from '../reference/extract.ts'

// Input has ordinary templates expanded, but retains inline reference tags.
class Block {
  #wiki
  #data

  constructor(wiki = '') {
    // Extract references before parsing the block's visible content.
    const extracted = extractReferences(wiki)
    this.#wiki = extracted.wiki
    this.#data = parse(this.#wiki)
    this.#data.citations = extracted.citations
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
    return splitSentences(this.#wiki).map((wiki) => new Block(wiki))
  }

  // Return occurrences, including repeated uses of the same named reference.
  citations() {
    return this.#data.citations.flatMap((citation) => citation.references)
  }

  citation(index = 0) {
    return this.citations()[index] || null
  }

  references() {
    return this.citations()
  }

  reference(index = 0) {
    return this.citation(index)
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

  json() {
    return {
      text: this.text(),
      links: this.links(),
      formatting: this.formatting(),
      citations: this.citations().map((citation) => citation.json()),
    }
  }
}

export default Block
