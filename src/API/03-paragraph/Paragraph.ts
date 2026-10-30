import Blocks from '../Block/Blocks.ts'
import Lists from './list/Lists.ts'
import Images from './image/Images.ts'
import Image from './image/Image.ts'
import List from './list/List.ts'
import Links from './link/Links.ts'
import Block from '../Block/Block.ts'
import { joinSentences } from '../../_lib/helpers.ts'
import type { ParagraphData, DocInfo } from '../../types/index.ts'

class Paragraph {
  #data: ParagraphData
  #info: DocInfo

  constructor(data: ParagraphData, info: DocInfo = {}) {
    this.#data = data
    this.#info = info
  }

  sentences() {
    const arr = this.#data.sentences || []
    return Blocks.from(arr.map((s) => new Block(s)))
  }

  lists() {
    const arr = this.#data.lists || []
    return Lists.from(arr.map((l) => new List(l)))
  }

  images() {
    const arr = this.#data.images || []
    return Images.from(arr.map((i) => new Image(i, this.#info)))
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

  text() {
    let str = joinSentences(this.sentences().map((s) => s.text()))
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
