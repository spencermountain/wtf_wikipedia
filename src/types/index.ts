export interface SectionData {
  title: string
  depth: number
  wiki: string
  index: number
  remaining: string

  templates: any[]
  tables: any[]
  infoboxes: any[]
  references: any[]
  paragraphs: any[]
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
  isRedirect?: boolean
  redirectTo?: string
  categories?: string[]
  sections?: SectionData[]
}
