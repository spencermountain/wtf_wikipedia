import wtf, { type Block, type Link, type LinkJson } from '../../types/index.js'
import wtfCjs = require('../../types/index.cjs')

export const doc = wtf('[[Alice]]')
export const pages: string[] = doc.links().page()
export const json: LinkJson[] = doc.links().json('xl')
export const filtered: Link[] = doc.links().filter((link) => link.page() === 'Alice')
export const mapped: string[] = doc.links().map((link) => link.page())
export const texts: string[] = doc.lists().text()
export const imageUrls: string[] = doc.images().thumbnail(100)
export const sentenceTexts: string[] = doc.sentences().text()
export const tableColumns: string[][] = doc.tables().cols()
export const headers: string[] = doc.tables()[0].headers().text()
export const rows: Record<string, string>[] = doc.tables()[0].rows()

export const box = doc.infobox()!
export const first: Block | undefined = box.get('name')
export const fallback: Block | undefined = box.getFirst(['name', 'title'])
export const allTexts: string[] = box.getAll(['name', 'title']).text()
export const infoboxImageUrls: string[] = box.images().url()
export const infoboxPages: string[] = box.links().page()
export const imagePages: string[] = doc.images()[0].links().page()
export const listPages: string[] = doc.lists()[0].links().page()
export const tablePages: string[] = doc.tables()[0].links().page()
export const templatePages: string[] = doc.templates()[0].links().page()
export const referencePages: string[] = doc.references()[0].links().page()
export const commonjsPages: string[] = wtfCjs('[[Alice]]').links().page()
export const preferredImage = doc.infobox()?.image()

export const introText: string = doc.section().text()
export const namedSectionText: string = doc.section('History').text()
export const indexedSectionText: string = wtfCjs('Hello').section(0).text()
// @ts-expect-error use sentences()[0].
doc.sentence()
// @ts-expect-error use templates()[0].
doc.template()
// @ts-expect-error use templates()[0] on sections too.
doc.sections()[0].template()

// @ts-expect-error map returns an ordinary array of strings.
mapped.json()
// @ts-expect-error filter returns an ordinary array of Links.
filtered.json()
// @ts-expect-error text returns an array, not a joined string.
export const joined: string = doc.links().text()
// @ts-expect-error forwarded arguments retain their types.
doc.links().json('invalid')
// @ts-expect-error get returns a single Block, not a collection.
first?.map((block) => block.text())
