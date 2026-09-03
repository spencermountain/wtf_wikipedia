import type { Plugin } from 'wtf_wikipedia'

export type DisambigPage = {
  link: string
  desc: string
}
export type Disambig = {
  text: string
  main: string | null
  pages: DisambigPage[]
}

declare module 'wtf_wikipedia' {
  interface Document {
    /** parse a disambiguation page into its list of pages. null when this page isn't one */
    disambiguation(): Disambig | null
    /** alias of disambiguation() */
    disambig(): Disambig | null
  }
}

declare const disambigPlugin: Plugin
export default disambigPlugin
