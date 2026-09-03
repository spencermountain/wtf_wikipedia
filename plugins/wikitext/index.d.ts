import type { Plugin } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document { makeWikitext(options?: object): string }
  interface Section { makeWikitext(options?: object): string }
  interface Paragraph { makeWikitext(options?: object): string }
  interface Sentence { makeWikitext(options?: object): string }
  interface Image { makeWikitext(options?: object): string }
  interface Infobox { makeWikitext(options?: object): string }
  interface Link { makeWikitext(options?: object): string }
  interface List { makeWikitext(options?: object): string }
  interface Reference { makeWikitext(options?: object): string }
  interface Table { makeWikitext(options?: object): string }
  interface Template { makeWikitext(options?: object): string }
}

/** adds .makeWikitext() to documents and their parts - pass to wtf.extend() */
declare const wikitextPlugin: Plugin
export default wikitextPlugin
