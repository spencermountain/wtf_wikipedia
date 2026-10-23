import Sentence from './sentence/Sentence.ts'
import Image from './image/Image.ts'
import List from './list/List.ts'
import Links from './link/Links.ts'
import type { ParagraphData, DocInfo } from '../../types/index.ts'

class Paragraph {
  #data: ParagraphData
  #info: DocInfo

  constructor(data: ParagraphData, info: DocInfo = {}) {
    this.#data = data
    this.#info = info
  }

  sentence() {
    return this.sentences()[0] || Sentence.empty()
  }
  sentences() {
    const arr = this.#data.sentences || []
    return arr.map((s) => new Sentence(s))
  }

  // TODO: List collections have nested JSON; keep plain arrays for now.
  lists() {
    const arr = this.#data.lists || []
    return arr.map((l) => new List(l))
  }

  images() {
    const arr = this.#data.images || []
    return arr.map((i) => new Image(i, this.#info))
  }

  links() {
    // Within a paragraph, collect images, lists, then sentences.
    let links = []
    this.images().forEach((i) => {
      links.push(...i.links())
    })
    this.lists().forEach((list) => {
      links.push(...list.links())
    })
    this.sentences().forEach((s) => {
      links.push(...s.links())
    })
    return Links.from(links)
  }

  interwiki() {
    return this.sentences().flatMap((s) => s.interwiki())
  }

  text() {
    let str = this.sentences()
      .map((s) => s.text())
      .join(' ')
    this.lists().forEach((list) => {
      str += '\n' + list.text()
    })
    return str
  }

  json(format = 'lg') {
    const json = structuredClone({
      wiki: this.wikitext(),
      images: this.images().map((image) => image.json(format)),
      lists: this.lists().map((list) => list.json(format)),
      sentences: this.sentences().map((sentence) => sentence.json(format)),
    })
    if (format === 'xl') {
      return json
    }
    delete json.wiki
    return json
  }

  wikitext() {
    return this.#data.wiki
  }
}

export default Paragraph
