export interface BlockData {
  text: string
  wiki: string
  links: LinkData[]
  fmt: {
    bold: string[]
    italic: string[]
  }
}

export interface TemplateData {
  template: string
  wiki?: string // original wiki text
  text?: string // BlockData?
  name?: string
  type?: string
  data?: object
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
  domain?: string
  caption?: BlockData
}
export type ListData = {
  items: BlockData[]
  wiki: string
}

export type LinkData = {
  text: string
  type?: string
  page?: string
  anchor?: string
  site?: string
  wiki: string
}

export type ParagraphData = {
  wiki: string
  remaining: string
  sentences: BlockData[]
  images: ImageData[]
  lists: ListData[]
}

export type TableData = string[][]

export interface SectionData {
  title: BlockData
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
  wiki: string
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

// Passed information from fetch/dumpster to use in the API
export interface DocInfo {
  title?: string
  pageId?: number
  wikidata?: number
  domain?: string
  lang?: string
  namespace?: string
  revisionId?: number
  version?: string
  timestamp?: string
  description?: string
  pageImage?: string
}
