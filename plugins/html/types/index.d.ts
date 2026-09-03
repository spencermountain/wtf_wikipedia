import type { Plugin } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document { html(options?: object): string }
  interface Section { html(options?: object): string }
  interface Paragraph { html(options?: object): string }
  interface Sentence { html(options?: object): string }
  interface Image { html(options?: object): string }
  interface Infobox { html(options?: object): string }
  interface Link { html(options?: object): string }
  interface List { html(options?: object): string }
  interface Reference { html(options?: object): string }
  interface Table { html(options?: object): string }
}

/** adds .html() to documents and their parts - pass to wtf.extend() */
declare const htmlPlugin: Plugin
export default htmlPlugin
