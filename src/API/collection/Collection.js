import Link from '../link/Link.ts'
import Section from '../02-section/Section.ts'
import Template from '../template/Template.ts'
import Infobox from '../infobox/Infobox.ts'

// abstraction for flexible API results
class Collection extends Array {
  static from(items, mapFn, thisArg) {
    const result = new Collection()
    Array.from(items, mapFn, thisArg).forEach((item) => result.push(item))
    return result
  }

  // Transforming array methods may produce values without model methods.
  static get [Symbol.species]() {
    return Array
  }

  filter(callback, thisArg) {
    // ensure filter result is a Collection
    return Collection.from(super.filter(callback, thisArg))
  }

  slice(start, end) {
    // ensure slice result is a Collection
    return Collection.from(super.slice(start, end))
  }

  isEmpty() {
    return this.length === 0
  }

  select(selector) {
    if (selector === undefined || selector === null) {
      return this
    }
    if (typeof selector === 'number') {
      return this.filter((_, index) => index === selector)
    }
    return this.filter((item) => this.matches(item, selector))
  }

  matches(item, selector) {
    if (typeof selector !== 'string') {
      return false
    }
    const name = selector.toLowerCase()
    if (item instanceof Link) {
      return item.page()?.toLowerCase() === name
    }
    if (item instanceof Section) {
      return item.title().toLowerCase() === name.trim()
    }
    if (item instanceof Template) {
      return item.data.template === name || item.data.name === name
    }
    if (item instanceof Infobox) {
      return item.type() === name.replace(/^infobox /, '').trim()
    }
    // Text matching for other model types is intentionally unsupported.
    return false
  }

  pages() {
    return this.map((link) => link.page())
  }

  json(options) {
    return this.map((item) => item.json(options))
  }

  text(options) {
    return this.map((item) => item.text(options)).join('\n')
  }

  wikitext() {
    return this.map((item) => item.wikitext()).join('\n')
  }
}

export default Collection
