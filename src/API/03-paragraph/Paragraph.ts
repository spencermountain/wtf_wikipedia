import Collection from '../collection/Collection.js'
import toJSON from './toJson.ts'
import Sentence from '../04-sentence/Sentence.ts'
import List from '../list/List.ts'
import setDefaults from '../_lib/setDefaults.ts'
import type { ParagraphData } from '../../types/index.ts'

const defaults = {
  sentences: true,
  lists: true,
  images: true,
}

class Paragraph {
  #data: ParagraphData

  constructor(data: ParagraphData) {
    this.#data = data
  }

  sentences(selector?) {
    const arr = this.#data.sentences || []
    return arr.map((s) => new Sentence(s))
  }

  sentence(selector?) {
    return this.sentences(selector)[0] ?? null
  }

  // TODO: List collections have nested JSON; keep plain arrays for now.
  lists() {
    const arr = this.#data.lists || []
    return arr.map((l) => new List(l))
  }

  list(selector?) {
    const items = this.lists()
    return items[selector ?? 0] ?? null
  }

  images(selector?) {
    return Collection.from(this.#data.images || []).select(selector)
  }

  image(selector?) {
    return this.images(selector)[0] ?? null
  }

  links(selector?) {
    const items = this.sentences().flatMap((s) => s.links())
    return Collection.from(items).select(selector)
  }

  link(selector?) {
    return this.links(selector)[0] ?? null
  }

  interwiki(selector?) {
    const items = this.sentences().flatMap((s) => s.interwiki())
    return Collection.from(items).select(selector)
  }

  text(options?) {
    options = setDefaults(options, defaults)
    let str = this.sentences()
      .map((s) => s.text(options))
      .join(' ')
    this.lists().forEach((list) => {
      str += '\n' + list.text()
    })
    return str
  }

  json(options?) {
    options = setDefaults(options, defaults)
    return toJSON(this, options)
  }

  wikitext() {
    return this.data.wiki
  }
}

export default Paragraph
