import type { Plugin } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document { markdown(options?: object): string }
  interface Section { markdown(options?: object): string }
  interface Paragraph { markdown(options?: object): string }
  interface Sentence { markdown(options?: object): string }
  interface Image { markdown(options?: object): string }
  interface Infobox { markdown(options?: object): string }
  interface Link { markdown(options?: object): string }
  interface List { markdown(options?: object): string }
  interface Reference { markdown(options?: object): string }
  interface Table { markdown(options?: object): string }
}

/** adds .markdown() to documents and their parts - pass to wtf.extend() */
declare const markdownPlugin: Plugin
export default markdownPlugin
