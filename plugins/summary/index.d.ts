import type { Plugin } from 'wtf_wikipedia'

export type SummaryOptions = {
  article?: boolean
  template?: boolean
  sentence?: boolean
  category?: boolean
  max?: number
  min?: number
}

declare module 'wtf_wikipedia' {
  interface Document {
    /** a short description of the page topic */
    summary(options?: SummaryOptions): string
    /** the pronoun or article for the topic - 'she', 'it', ... */
    article(): string
    /** is the topic in the past, present or future? */
    tense(): 'Past' | 'Present' | 'Future'
  }
}

declare const summaryPlugin: Plugin
export default summaryPlugin
