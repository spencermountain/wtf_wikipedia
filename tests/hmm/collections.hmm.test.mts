import wtf, { type Collection, type LinkCollection, type LinkJson, type SectionCollection, type Sentence } from '../../types/index.js'

const doc = wtf('[[Toronto]]')
const links: LinkCollection = doc.links('Toronto').filter(link => link.page() === 'Toronto').slice(0)
const pages: string[] = links.pages()
const json: LinkJson[] = links.json()
const mapped: string[] = links.map(link => link.page())
const sections: SectionCollection = doc.sections('Places').select(0)
const sentences: Collection<Sentence> = doc.sentences(0)
const alias: wtf.LinkCollection = links
const genericAlias: wtf.Collection<Sentence> = sentences
void [pages, json, mapped, sections, alias, genericAlias]

// @ts-expect-error Mapping to strings no longer exposes model output methods.
links.map(link => link.page()).json()
// @ts-expect-error Paragraph collections have no string matching semantics.
doc.paragraphs('missing')
