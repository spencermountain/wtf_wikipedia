import type { LinkData, InternalLinkData, ExternalLinkData } from '../../../types/index.ts'
import wikis from '../../../_data/interwiki.ts'
import normalizeProject from '../../../_lib/project.ts'

class Link {
  #data: InternalLinkData & ExternalLinkData

  constructor(data: LinkData) {
    this.#data = data
  }

  text() {
    return this.#data.text
  }

  json(format = 'lg') {
    const json = structuredClone(this.#data)
    if (format === 'xl') {
      return json
    }
    delete json.wiki
    return json
  }

  wikitext() {
    let txt = this.#data.wiki || ''
    return txt
  }

  page() {
    return this.#data.page || ''
  }

  anchor() {
    return this.#data.anchor || ''
  }

  // which wiki, for interwiki links
  wiki() {
    const { lang, project, prefix } = this.#data
    return project || prefix || lang || ''
  }

  type() {
    return this.#data.type
  }

  //create a url for any type of link
  href() {
    const { type, prefix, project, lang, site } = this.#data
    if (type === 'external') {
      return site || ''
    }
    let page = this.page()
    if (!prefix) {
      page = page.replace(/ /g, '_')
    }
    page = encodeURIComponent(page)
    let url = `./${page}`

    if (type === 'interwiki') {
      const wiki = normalizeProject(prefix || project || 'wikipedia')
      if (!Object.hasOwn(wikis, wiki)) {
        return ''
      }
      url = 'http://' + wikis[wiki]
      // Qualified language prefixes override the project's default language.
      if (lang && !prefix) {
        url = url.replace('://en.', `://${lang}.`)
      }
      url = url.replace(/\$1/g, page)
    }
    //add anchor on the end
    if (this.anchor()) {
      url += '#' + encodeURIComponent(this.anchor().replace(/ /g, '_'))
    }
    return url
  }
}

export default Link
