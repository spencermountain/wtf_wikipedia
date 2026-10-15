export interface TemplateData {
  wiki: string // original wiki text
  text: string // remaining output text
  name: string
  json: object
  nested?: boolean
}

export interface InfoboxData extends TemplateData {
  type: string
  // data?: object[]
}
export interface ReferenceData extends TemplateData {}

export type ImageData = {
  file: string
  wiki: string
  alt?: string
  caption?: string
}
export type ListData = {
  items: string[]
  wiki: string
}

export type LinkData = {
  text: string
  type?: string
  page?: string
  wiki: string
}

export type SentenceData = {
  text: string
  wiki: string
  links: LinkData[]
  fmt: {
    bold?: string[]
    italic?: string[]
  }
}

export type ParagraphData = {
  wiki: string
  remaining: string
  sentences: SentenceData[]
  images: ImageData[]
  lists: ListData[]
}

export type TableData = string[][]

export interface SectionData {
  title: string
  depth: number
  wiki: string
  index: number
  remaining: string

  templates: TemplateData[]
  infoboxes: InfoboxData[]
  references: ReferenceData[]
  tables: TableData[]
  paragraphs: ParagraphData[]
}

export interface PageData {
  // original text input
  wikitext: string
  remaining: string

  // optional data from api/dumpster
  title?: string
  pageId?: number
  wikidata?: number
  domain?: string
  lang?: string
  namespace?: string
  revisionId?: number

  // parsed values
  sections: SectionData[]
  categories: string[]
  isRedirect?: boolean
  redirectTo?: string
}
