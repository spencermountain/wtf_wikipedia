export interface LinkData {
  text: string
  type: 'internal' | 'external' | 'interwiki'
  wiki: string
  inline?: boolean
}

export interface InternalLinkData extends LinkData {
  page?: string
  anchor?: string
  lang?: string
  project?: string
  prefix?: string
}

export interface ExternalLinkData extends LinkData {
  site?: string
}

export interface FormattingData {
  text: string
  start: number
  end: number
}

export interface BlockData {
  text: string
  wiki: string
  links?: LinkData[]
  bolds?: FormattingData[]
  italics?: FormattingData[]
}

export interface TemplateData {
  links?: LinkData[]
  template: string
  kind: string | null
  wiki: string
  text: string
  data: Record<string, any>
}

export interface ReferenceData extends TemplateData {}

export interface InfoboxData extends TemplateData {}

export interface ImageData {
  file: string
  wiki: string
  alt?: string
  domain?: string
  caption?: BlockData
}
export interface ListData {
  items: BlockData[]
  wiki: string
}

export interface ParagraphData {
  wiki: string
  remaining: string
  sentences: BlockData[]
  images: ImageData[]
  lists: ListData[]
}

export interface TableData {
  wiki: string
  rows: object[]
  headers: BlockData[]
}

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
  project?: string
  namespace?: string
  revisionId?: number
  version?: string
  timestamp?: string
  description?: string
  pageImage?: string
}
