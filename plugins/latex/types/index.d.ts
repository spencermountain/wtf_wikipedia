import type { Plugin } from 'wtf_wikipedia'

declare module 'wtf_wikipedia' {
  interface Document { latex(options?: object): string }
  interface Section { latex(options?: object): string }
  interface Paragraph { latex(options?: object): string }
  interface Sentence { latex(options?: object): string }
  interface Image { latex(options?: object): string }
  interface Infobox { latex(options?: object): string }
  interface Link { latex(options?: object): string }
  interface List { latex(options?: object): string }
  interface Reference { latex(options?: object): string }
  interface Table { latex(options?: object): string }
}

/** adds .latex() to documents and their parts - pass to wtf.extend() */
declare const latexPlugin: Plugin
export default latexPlugin
